import express from 'express'
const app = express()
const port = 3000

import routesClientes from "./routes/clientes"
import routesFilmes from "./routes/filmes"
import routesAlugueis from "./routes/alugueis"

app.use(express.json())

app.use("/clientes", routesClientes)
app.use("/filmes", routesFilmes)
app.use("/alugueis", routesAlugueis)

app.get('/', (req, res) => {
  res.send('API: Sistema de Gerenciamento de Aluguéis (Prime Video)')
})

app.listen(port, () => {
  console.log(`Servidor Rodando na Porta: ${port}`)
})
