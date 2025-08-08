import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Alumno } from "../../../types/alumnos.types";



interface alumnosResponse {
  message: string;
  data: Alumno[];
  error?: string;
}

export const alumnosApi = createApi({
  reducerPath: "alumnosApi = createApi({",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Traer todas las materias
    getAlumnos: builder.query<alumnosResponse, void>({
      query: () => "/alumnos",
    }),
  }),
});

// Hooks auto-generados
export const {
  useGetAlumnosQuery,
} = alumnosApi






