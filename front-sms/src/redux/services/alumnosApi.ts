import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Alumno } from "../../../types/alumnos.types";



interface alumnosResponse {
  message: string;
  data: Alumno[];
  error?: string;
}

interface AlumnoResponse {
  message: string;
  data: Alumno;
  error?: string;
  success?: boolean;
  enrollment?: {
    totalClases: number;
    inscripcionesCreadas: number;
  };
}

export const alumnosApi = createApi({
  reducerPath: "alumnosApi = createApi({",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    // Traer todas las materias
    getAlumnos: builder.query<alumnosResponse, void>({
      query: () => "/alumnos",
    }),

    //traer alumno por id
    getAlumnobyId: builder.query<AlumnoResponse, string>({
      query: (id) => `/alumnos/${id}`,
    }),

    //crear alumno
    createAlumno: builder.mutation<AlumnoResponse, Partial<Alumno>>({
      query: (alumno) => {
        console.log("🛠️ Enviando alumno desde mutation:", alumno);
        return {
          url: "alumnos",
          method: "POST",
          body: alumno,
        };
      }
    }),

    // Actualizar alumno
    updateAlumno: builder.mutation<AlumnoResponse, { id: string; data: Partial<Alumno> }>({
      query: ({ id, data }) => {
        console.log("🛠️ Enviando alumno desde mutation:", data);
        return {
          url: `/alumnos/${id}`,
          method: "PUT",
          body: data,
        };
      },
    }),
  }),
});

// Hooks auto-generados
export const {
  useGetAlumnosQuery,
  useCreateAlumnoMutation,
  useUpdateAlumnoMutation,
  useGetAlumnobyIdQuery,
} = alumnosApi






