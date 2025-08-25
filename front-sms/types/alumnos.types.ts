import { Nota } from "./nota.type";


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

