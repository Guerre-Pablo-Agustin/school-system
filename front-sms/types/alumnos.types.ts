import { Nota } from "./nota.type";
import { Clase } from "./Usuario.type";

export interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  direccion: string;
  grado: number; // Ej: "1ro, 2do"
  seccion: string; // Ej: "A, B"
  notas: Nota[];
  inscripciones: Nota[];
}

/*
model ClaseEstudiante {
  id           String      @id @default(uuid())
  clase        Clase       @relation(fields: [claseId], references: [id])
  claseId      String
  estudiante   Estudiante  @relation(fields: [estudianteId], references: [id])
  estudianteId String
  createdAt    DateTime    @default(now())

  @@unique([claseId, estudianteId])
  @@map("clase_estudiante")
}
*/
