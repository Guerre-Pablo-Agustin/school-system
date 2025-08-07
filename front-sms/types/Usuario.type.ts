import { Materia } from "./materia.types";

type UserRole = 'ADMIN' | 'DOCENTE' | 'SUPER_ADMIN';

export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string; // hash
  rol: UserRole;
  clases: Clase[]; // Solo si es docente
}

export interface Clase {
  id: string;
  nombre: string;
  materia: Materia;
  docente: User;
}

export interface FilterUser {
  nombre?: string;
  email?: string;
  rol?: UserRole;
  materias?: Materia[];
}