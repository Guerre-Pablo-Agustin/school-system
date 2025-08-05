/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Materia` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `Materia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Materia" ADD COLUMN     "codigo" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Materia_codigo_key" ON "public"."Materia"("codigo");
