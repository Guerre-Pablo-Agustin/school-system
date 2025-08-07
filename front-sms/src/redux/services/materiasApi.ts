import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Materia } from "../../../types/materia.types";


interface MateriasResponse {
  message: string;
  data: Materia[];
  error?: string;
}

export const materiasApi = createApi({
  reducerPath: "materiasApi = createApi({",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Traer todas las materias
    getMaterias: builder.query<MateriasResponse, void>({
      query: () => "/materias",
    }),

    // Traer materias por codigo
    getMateriasByCodigo: builder.query<MateriasResponse, string>({
      query: (codigo) => `/materias/codigo/${codigo}`,
    }), 
  }),
});

// Hooks auto-generados
export const {
  useGetMateriasQuery,
} = materiasApi






