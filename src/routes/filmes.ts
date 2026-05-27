import { prisma } from "../../lib/prisma"
import { Router } from 'express'
import { z } from 'zod'

const router = Router()

const filmeSchema = z.object({
  titulo: z.string().min(2, { message: "Título do filme deve possuir, no mínimo, 2 caracteres" }),
  genero: z.string().min(3),
  preco: z.number().positive({ message: "Preço deve ser um valor positivo"})
})

router.get("/", async (req, res) => {
  try {
    const filmes = await prisma.filme.findMany()
    res.status(200).json(filmes)
  } catch (error) {
    res.status(500).json({ erro: error })
  }
})

router.post("/", async (req, res) => {
  const valida = filmeSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { titulo, genero, preco } = valida.data

  try {
    const filme = await prisma.filme.create({
      data: { titulo, genero, preco }
    })
    res.status(201).json(filme)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const filme = await prisma.filme.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(filme)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
  const { id } = req.params
  const valida = filmeSchema.safeParse(req.body)
  if (!valida.success) {
    res.status(400).json({ erro: valida.error })
    return
  }

  const { titulo, genero, preco } = valida.data

  try {
    const filme = await prisma.filme.update({
      where: { id: Number(id) },
      data: { titulo, genero, preco }
    })
    res.status(200).json(filme)
  } catch (error) {
    res.status(400).json({ error })
  }
})

export default router
