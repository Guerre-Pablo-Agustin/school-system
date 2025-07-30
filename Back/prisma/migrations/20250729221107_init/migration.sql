-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'DOCENTE');

-- CreateEnum
CREATE TYPE "public"."Ciclo" AS ENUM ('PRIMARIA', 'SECUNDARIA');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "public"."UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "grado" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Materia" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "ciclo" "public"."Ciclo" NOT NULL,
    "docenteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Nota" (
    "id" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "bimestre" INTEGER NOT NULL,
    "alumnoId" TEXT NOT NULL,
    "materiaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ponderacion" (
    "id" TEXT NOT NULL,
    "ciclo" "public"."Ciclo" NOT NULL,
    "bimestre" INTEGER NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ponderacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_dni_key" ON "public"."Student"("dni");

-- AddForeignKey
ALTER TABLE "public"."Materia" ADD CONSTRAINT "Materia_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Nota" ADD CONSTRAINT "Nota_alumnoId_fkey" FOREIGN KEY ("alumnoId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Nota" ADD CONSTRAINT "Nota_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "public"."Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
