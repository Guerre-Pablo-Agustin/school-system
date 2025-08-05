export type Bimestre = 1 | 2 | 3 | 4;

export interface Nota {
  id: string;
  valor: number;
  bimestre: Bimestre;
  alumnoId: string;
  materiaId: string;
}

export interface Ponderacion {
  id: string;
  ciclo: 'PRIMARIA' | 'SECUNDARIA';
  bimestre: Bimestre;
  peso: number; // porcentaje (ej: 0.25)
}