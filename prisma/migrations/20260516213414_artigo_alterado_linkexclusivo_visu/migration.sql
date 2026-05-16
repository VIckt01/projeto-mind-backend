/*
  Warnings:

  - You are about to drop the column `banner` on the `article` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `article` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `excerpt` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `article` DROP COLUMN `banner`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `excerpt` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageUrl` TEXT NULL,
    ADD COLUMN `likes` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `slug` VARCHAR(191) NOT NULL,
    ADD COLUMN `views` INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX `Article_slug_key` ON `Article`(`slug`);
