import { Nota } from "./nota.type";

export interface Student {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  grado: string; // Ej: "1ro Primaria"
  notas: Nota[];
}

