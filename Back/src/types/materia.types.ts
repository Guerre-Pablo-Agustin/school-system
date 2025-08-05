import { Nota } from "./nota.type";

export interface Materia {
  id: string;
  nombre: string;
  ciclo: 'PRIMARIA' | 'SECUNDARIA';
  docenteId: string;
  codigo: string;
  notas: Nota[];
}
