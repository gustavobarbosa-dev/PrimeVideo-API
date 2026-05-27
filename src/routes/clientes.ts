import { prisma } from "../../lib/prisma"
import { Router } from "express"
import { z } from "zod"
import nodemailer from "nodemailer"

const router = Router()

const clienteSchema = z.object({
    nome: z.string().min(3, 'Nome deve possuir no mínimo com 3 caracteres'),
    email: z.string().email('Email inválido'),
    saldo: z.number().nonnegative('O saldo não pode ser negativo').default(0)
})

router.get("/", async (req, res) => {
    try {
        const clientes = await prisma.cliente.findMany()
        res.status(200).json(clientes)
    } catch (error) {
        res.status(500).json({ erro: "Erro no servidor" })
    }
})

router.post("/", async (req, res) => {
    const valida = clienteSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, email, saldo } = valida.data

    try {
        const cliente = await prisma.cliente.create({
            data: { nome, email, saldo }
        })
        res.status(201).json(cliente)
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params
    const valida = clienteSchema.safeParse(req.body)

    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, email, saldo } = valida.data

    try {
        const cliente = await prisma.cliente.update({
            where: { id: Number(id) },
            data: { nome, email, saldo }
        })
        res.status(200).json(cliente)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
    try {
        const cliente = await prisma.cliente.delete({
            where: { id: Number(id) }
        })
        res.status(200).json(cliente)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id)
    try {
        const cliente = await prisma.cliente.findUnique({ where: { id } })
        if (!cliente) {
            res.status(404).json({ erro: 'Cliente não cadastrado' })
            return
        }
        res.status(200).json(cliente)
    } catch (error) {
        res.status(500).json({ erro: 'Erro interno do servidor' })
    }
})

// === SISTEMA DE ENVIO DE E-MAIL ===

function gerarTabelaHTML(dados: any) {
  let html = `
    <html>
    <body style="font-family: Helvetica, Arial, sans-serif;">
    <h2>Prime Video: Histórico de Aluguéis</h2>
    <h3>Cliente: ${dados.nome} | E-mail: ${dados.email}</h3>
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <thead style="background-color: rgb(195, 191, 191);">
        <tr>
          <th>Data do Aluguel</th>
          <th>Filme</th>
          <th>Gênero</th>
          <th>Pagamento</th>
          <th>Valor R$</th>
        </tr>
      </thead>
      <tbody>
  `;

  let totalAlugueis = 0;
  for (const aluguel of dados.alugueis) {
    totalAlugueis += Number(aluguel.valor)

    const data = new Date(aluguel.dataRet)
    const dataFormatada = data.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

    html += `
      <tr>
        <td>${dataFormatada}</td>
        <td>${aluguel.filme.titulo}</td>
        <td>${aluguel.filme.genero}</td>
        <td>${aluguel.pagamento}</td>
        <td style="text-align: right;">${Number(aluguel.valor).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</td>
      </tr>
    `;
  }

  html += `
      <tr style="font-weight: bold; background-color:rgb(235, 232, 232);">
        <td colspan="4" style="text-align: right;">Total em Aluguéis:</td>
        <td style="text-align: right;">R$ ${totalAlugueis.toLocaleString("pt-br", { minimumFractionDigits: 2 })}</td>
      </tr>
          </tbody>
        </table>
        <h3> Saldo Atual na Carteira R$: ${Number(dados.saldo).toLocaleString("pt-br", { minimumFractionDigits: 2 })} </h3>
      </body>
    </html>
  `;
  return html;
}

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_EMAIL,
    pass: process.env.MAILTRAP_SENHA
  },
});

async function enviaEmail(dados: any) {
  const mensagem = gerarTabelaHTML(dados)
  const info = await transporter.sendMail({
    from: 'Prime Video <nao-responda@primevideo.com>',
    to: dados.email,
    subject: "Seu Relatório de Aluguéis e Transações",
    text: "Relatório de Aluguéis...",
    html: mensagem,
  });
  console.log("E-mail enviado:", info.messageId);
}

router.get("/email/:id", async (req, res) => {
  const { id } = req.params
  try {
    const cliente = await prisma.cliente.findFirst({
      where: { id: Number(id) },
      include: {
        alugueis: {
          include: {
            filme: true
          }
        }
      }
    })

    if(!cliente) {
        res.status(404).json({erro: "Cliente não localizado"})
        return
    }

    enviaEmail(cliente)
    res.status(200).json(cliente)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

export default router
