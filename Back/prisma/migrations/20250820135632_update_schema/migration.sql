/*
  Warnings:

  - You are about to drop the `Clase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Estudiante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Materia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Nota` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ponderacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ClaseToEstudiante` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Clase" DROP CONSTRAINT "Clase_docenteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Clase" DROP CONSTRAINT "Clase_materiaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Nota" DROP CONSTRAINT "Nota_estudianteId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Nota" DROP CONSTRAINT "Nota_materiaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ClaseToEstudiante" DROP CONSTRAINT "_ClaseToEstudiante_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ClaseToEstudiante" DROP CONSTRAINT "_ClaseToEstudiante_B_fkey";

-- DropTable
DROP TABLE "public"."Clase";

-- DropTable
DROP TABLE "public"."Estudiante";

-- DropTable
DROP TABLE "public"."Materia";

-- DropTable
DROP TABLE "public"."Nota";

-- DropTable
DROP TABLE "public"."Ponderacion";

-- DropTable
DROP TABLE "public"."User";

-- DropTable
DROP TABLE "public"."_ClaseToEstudiante";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT,
    "rol" "public"."Rol" NOT NULL DEFAULT 'DOCENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."estudiantes" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "grado" INTEGER NOT NULL,
    "seccion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notas" (
    "id" TEXT NOT NULL,
    "estudianteId" TEXT NOT NULL,
    "materiaId" TEXT NOT NULL,
    "claseId" TEXT,
    "bimestre" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "docenteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."materias" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ciclo" "public"."Ciclo" NOT NULL,
    "grado" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clases" (
    "id" TEXT NOT NULL,
    "docenteId" TEXT NOT NULL,
    "materiaId" TEXT NOT NULL,
    "anioLectivo" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clase_estudiante" (
    "id" TEXT NOT NULL,
    "claseId" TEXT NOT NULL,
    "estudianteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clase_estudiante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ponderaciones" (
    "id" TEXT NOT NULL,
    "ciclo" "public"."Ciclo" NOT NULL,
    "formula" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ponderaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_dni_key" ON "public"."estudiantes"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "notas_estudianteId_materiaId_bimestre_claseId_key" ON "public"."notas"("estudianteId", "materiaId", "bimestre", "claseId");

-- CreateIndex
CREATE UNIQUE INDEX "materias_codigo_key" ON "public"."materias"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "clases_docenteId_materiaId_anioLectivo_key" ON "public"."clases"("docenteId", "materiaId", "anioLectivo");

-- CreateIndex
CREATE UNIQUE INDEX "clase_estudiante_claseId_estudianteId_key" ON "public"."clase_estudiante"("claseId", "estudianteId");

-- CreateIndex
CREATE UNIQUE INDEX "ponderaciones_ciclo_key" ON "public"."ponderaciones"("ciclo");

-- AddForeignKey
ALTER TABLE "public"."notas" ADD CONSTRAINT "notas_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "public"."estudiantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notas" ADD CONSTRAINT "notas_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "public"."materias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notas" ADD CONSTRAINT "notas_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "public"."clases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notas" ADD CONSTRAINT "notas_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clases" ADD CONSTRAINT "clases_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clases" ADD CONSTRAINT "clases_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "public"."materias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clase_estudiante" ADD CONSTRAINT "clase_estudiante_claseId_fkey" FOREIGN KEY ("claseId") REFERENCES "public"."clases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clase_estudiante" ADD CONSTRAINT "clase_estudiante_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "public"."estudiantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
