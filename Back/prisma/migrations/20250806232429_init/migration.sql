/*
  Warnings:

  - You are about to drop the column `docenteId` on the `Materia` table. All the data in the column will be lost.
  - You are about to drop the column `alumnoId` on the `Nota` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Nota` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `Nota` table. All the data in the column will be lost.
  - You are about to drop the column `bimestre` on the `Ponderacion` table. All the data in the column will be lost.
  - You are about to drop the column `peso` on the `Ponderacion` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Ponderacion` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[estudianteId,materiaId,bimestre]` on the table `Nota` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ciclo]` on the table `Ponderacion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `docenteId` to the `Nota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estudianteId` to the `Nota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nota` to the `Nota` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formula` to the `Ponderacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direccion` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `rol` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Rol" AS ENUM ('ADMIN', 'DOCENTE', 'SUPERADMIN');

-- DropForeignKey
ALTER TABLE "public"."Materia" DROP CONSTRAINT "Materia_docenteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Nota" DROP CONSTRAINT "Nota_alumnoId_fkey";

-- AlterTable
ALTER TABLE "public"."Materia" DROP COLUMN "docenteId";

-- AlterTable
ALTER TABLE "public"."Nota" DROP COLUMN "alumnoId",
DROP COLUMN "updatedAt",
DROP COLUMN "valor",
ADD COLUMN     "docenteId" TEXT NOT NULL,
ADD COLUMN     "estudianteId" TEXT NOT NULL,
ADD COLUMN     "nota" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "public"."Ponderacion" DROP COLUMN "bimestre",
DROP COLUMN "peso",
DROP COLUMN "updatedAt",
ADD COLUMN     "formula" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "updatedAt",
ADD COLUMN     "direccion" TEXT NOT NULL,
ADD COLUMN     "telefono" TEXT NOT NULL,
DROP COLUMN "rol",
ADD COLUMN     "rol" "public"."Rol" NOT NULL;

-- DropTable
DROP TABLE "public"."Student";

-- DropEnum
DROP TYPE "public"."UserRole";

-- CreateTable
CREATE TABLE "public"."Estudiante" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "grado" INTEGER NOT NULL,
    "seccion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Clase" (
    "id" TEXT NOT NULL,
    "docenteId" TEXT NOT NULL,
    "materiaId" TEXT NOT NULL,

    CONSTRAINT "Clase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_dni_key" ON "public"."Estudiante"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "Clase_docenteId_materiaId_key" ON "public"."Clase"("docenteId", "materiaId");

-- CreateIndex
CREATE UNIQUE INDEX "Nota_estudianteId_materiaId_bimestre_key" ON "public"."Nota"("estudianteId", "materiaId", "bimestre");

-- CreateIndex
CREATE UNIQUE INDEX "Ponderacion_ciclo_key" ON "public"."Ponderacion"("ciclo");

-- AddForeignKey
ALTER TABLE "public"."Nota" ADD CONSTRAINT "Nota_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "public"."Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Clase" ADD CONSTRAINT "Clase_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Clase" ADD CONSTRAINT "Clase_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "public"."Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
