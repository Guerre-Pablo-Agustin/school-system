import { Materia } from "./materia.types";

type UserRole = 'ADMIN' | 'DOCENTE' | 'SUPER_ADMIN';

export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string; // hash
  rol: UserRole;
  materias: Materia[]; // Solo si es docente
}

export interface FilterUser {
  nombre?: string;
  email?: string;
  rol?: UserRole;
  materias?: Materia[];
}