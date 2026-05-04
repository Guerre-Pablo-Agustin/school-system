
import { Asignatura } from "./materia.types";
import { Nota } from "./nota.type";

type UserRole = 'ADMIN' | 'DOCENTE' | 'DIRECTIVO';

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string; // hash
  rol: UserRole;
  telefono: string;
  direccion: string;
  clases: Clase[]; // Solo si es docente
}

interface AlumnoClase {
    id: string,
    nombre: string,
    apellido: string,
    grado: string,
    seccion: string,
    notas: Nota[],
    promedio: number | null
}


export interface Clase {
  id: string;
  nombre: string;
  materiaId: string;
  docenteId: string;
  materia: Asignatura;
  docente: User;
  estudiantes: AlumnoClase[];
  anioLectivo: number;
  notas: Nota[];
}

export interface FilterUser {
  nombre?: string;
  email?: string;
  rol?: UserRole;
  materias?: Asignatura[];
}


export type ApiError = {
  data: {
    message: string;
  };
  status: number;
};