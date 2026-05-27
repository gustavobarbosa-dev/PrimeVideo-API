/*
  Warnings:

  - You are about to drop the `alunos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `depositos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `produtos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `depositos` DROP FOREIGN KEY `depositos_alunoId_fkey`;

-- DropForeignKey
ALTER TABLE `vendas` DROP FOREIGN KEY `vendas_alunoId_fkey`;

-- DropForeignKey
ALTER TABLE `vendas` DROP FOREIGN KEY `vendas_produtoId_fkey`;

-- DropTable
DROP TABLE `alunos`;

-- DropTable
DROP TABLE `depositos`;

-- DropTable
DROP TABLE `produtos`;

-- DropTable
DROP TABLE `vendas`;

-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(60) NOT NULL,
    `email` VARCHAR(60) NOT NULL,
    `saldo` DECIMAL(9, 2) NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filmes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(60) NOT NULL,
    `genero` VARCHAR(40) NOT NULL,
    `preco` DECIMAL(9, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `alugueis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `filmeId` INTEGER NOT NULL,
    `valor` DECIMAL(9, 2) NOT NULL,
    `dataRet` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `datadevolucao` DATETIME(3) NULL,
    `pagamento` ENUM('PIX', 'Cartao', 'Saldo') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `alugueis` ADD CONSTRAINT `alugueis_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `alugueis` ADD CONSTRAINT `alugueis_filmeId_fkey` FOREIGN KEY (`filmeId`) REFERENCES `filmes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
