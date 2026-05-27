import { prisma } from "../lib/prisma";
import { type Prisma } from "../generated/prisma/client"

const filmes: Prisma.FilmeCreateInput[] = [
    { titulo: "A Origem", genero: "Ficção Científica", preco: 14.90 },
    { titulo: "O Senhor dos Anéis", genero: "Fantasia", preco: 19.90 },
    { titulo: "Vingadores: Ultimato", genero: "Ação", preco: 16.50 },
    { titulo: "Parasita", genero: "Suspense", preco: 12.00 },
    { titulo: "Interestelar", genero: "Ficção Científica", preco: 15.00 }
]

async function main() {
    try {
        await prisma.filme.createMany({ data: filmes })
        console.log(`${filmes.length} Filmes Cadastrados...`)
    } catch (error) {
        console.error("Erro nas Inclusões (Seeds):", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

await main()
