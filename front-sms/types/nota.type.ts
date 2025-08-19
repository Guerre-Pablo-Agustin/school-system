import { Materia } from "./materia.types";

type Bimestre = 1 | 2 | 3 | 4;

export interface Nota {
  id: string;
  nota: number;
  bimestre: Bimestre;
  alumnoId: string;
  materia: Materia
  ;
}

export interface Ponderacion {
  id: string;
  ciclo: 'PRIMARIA' | 'SECUNDARIA';
  bimestre: Bimestre;
  peso: number; // porcentaje (ej: 0.25)
}

export interface NotaParcial {
  id?: string;
  nota: number;
  bimestre: number;
  alumnoId?: string;
  materia?: Materia;
}

