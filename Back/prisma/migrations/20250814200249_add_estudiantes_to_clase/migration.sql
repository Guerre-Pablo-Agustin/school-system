-- CreateTable
CREATE TABLE "public"."_ClaseToEstudiante" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClaseToEstudiante_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ClaseToEstudiante_B_index" ON "public"."_ClaseToEstudiante"("B");

-- AddForeignKey
ALTER TABLE "public"."_ClaseToEstudiante" ADD CONSTRAINT "_ClaseToEstudiante_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Clase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ClaseToEstudiante" ADD CONSTRAINT "_ClaseToEstudiante_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Estudiante"("id") ON DELETE CASCADE ON UPDATE CASCADE;
