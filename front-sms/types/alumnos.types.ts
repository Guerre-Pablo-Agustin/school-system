import { Nota } from "./nota.type";

export interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  grado: string; // Ej: "1ro, 2do"
  seccion: string; // Ej: "A, B"
  notas: Nota[];
}

