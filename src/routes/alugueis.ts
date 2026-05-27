import { prisma } from "../../lib/prisma"
import { Router } from 'express'
import { z } from 'zod'

const router = Router()

const aluguelSchema = z.object({
  usuarioId: z.number(),
  filmeId: z.number(),
  pagamento: z.enum(["PIX", "Cartao", "Saldo"], { message: "Pagamento deve ser PIX, Cartao ou Saldo" })
})

router.get("/", async (req, res) => {
  try {
    const alugueis = await prisma.aluguel.findMany({
      include: {
        usuario: true,
        filme: true
      }
    })
    res.status(200).json(alugueis)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

// === TRANSAÇÃO DE INCLUSÃO ===
router.post("/", async (req, res) => {
  const valida = aluguelSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { usuarioId, filmeId, pagamento } = valida.data

  const dadoCliente = await prisma.cliente.findUnique({ where: { id: usuarioId } })
  if (!dadoCliente) {
    res.status(400).json({ erro: "Erro... Código do usuário (cliente) inválido" })
    return
  }

  const dadoFilme = await prisma.filme.findUnique({ where: { id: filmeId } })
  if (!dadoFilme) {
    res.status(400).json({ erro: "Erro... Código do filme inválido" })
    return
  }

  // Verifica se o cliente tem saldo (carteira) suficiente para cobrir o filme
  if (Number(dadoFilme.preco) > Number(dadoCliente.saldo)) {
    res.status(400).json({ erro: `Erro... Saldo do Usuário é insuficiente (R$ ${dadoCliente.saldo})` })
    return
  }

  try {
    // TRANSAÇÃO DE INCLUSÃO: Inclui o aluguel E subtrai do saldo simultaneamente
    const [aluguel, cliente] = await prisma.$transaction([
      prisma.aluguel.create({
        data: { usuarioId, filmeId, valor: Number(dadoFilme.preco), pagamento }
      }),
      prisma.cliente.update({
        where: { id: usuarioId },
        data: { saldo: { decrement: Number(dadoFilme.preco) } }
      })
    ])
    res.status(201).json({ aluguel, cliente })
  } catch (error) {
    res.status(400).json({ error })
  }
})

// === TRANSAÇÃO DE EXCLUSÃO ===
router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const aluguelExcluido = await prisma.aluguel.findUnique({ where: { id: Number(id) } })
    if(!aluguelExcluido) {
        res.status(404).json({erro: "Aluguel não localizado."})
        return
    }

    // TRANSAÇÃO DE ESTORNO: Deleta o aluguel E devolve o dinheiro ao saldo simultaneamente
    const [aluguel, cliente] = await prisma.$transaction([
      prisma.aluguel.delete({ where: { id: Number(id) } }),
      prisma.cliente.update({
        where: { id: aluguelExcluido.usuarioId },
        data: { saldo: { increment: Number(aluguelExcluido.valor) } }
      })
    ])

    res.status(200).json({ aluguel, cliente, status: "Estornado com sucesso" })
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

export default router
