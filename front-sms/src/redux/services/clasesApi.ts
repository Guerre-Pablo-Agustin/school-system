import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Clase } from "../../../types/Usuario.type";


interface ClasesResponse {
  message: string;
  data: Clase[];
  error?: string;
}

export const clasesApi = createApi({
  reducerPath: "clasesApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Traer todas las clases
    getClases: builder.query<Clase[], void>({
      query: () => "/clases",
    }),

    // Traer clases por docente
    getClasesByDocente: builder.query<ClasesResponse, string>({
      query: (docenteId) => `/clases/docente/${docenteId}`,
    }),

    // Traer clases por materia
    getClasesByMateria: builder.query<Clase[], string>({
      query: (materiaId) => `/clases/materia/${materiaId}`,
    }),

    // Traer clases por alumno
    getClasesByAlumno: builder.query<Clase[], string>({
      query: (alumnoId) => `/clases/alumno/${alumnoId}`,
    }),
  }),
});

// Hooks auto-generados
export const {
  useGetClasesQuery,
  useGetClasesByDocenteQuery,
  useGetClasesByMateriaQuery,
  useGetClasesByAlumnoQuery,
} = clasesApi;






