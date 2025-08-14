import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Nota } from "../../../types/nota.type";



interface NotasResponse {
  message: string;
  data: Nota[];
  error?: string;
}

interface NotaResponse {
  message: string;
  data: {
    id: string;
    estudianteId: string;
    materiaId: string;
    bimestre: number;
    nota: number;
    docenteId: string;
    createdAt: string;
    updatedAt: string;
  };
  action: "created" | "updated";
  existingData?: {
    id: string;
    notaActual: number;
  };
}
export const notasApi = createApi({
  reducerPath: "notasApi = createApi({",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({

    // Traer todas las notas
    getNotas: builder.query<NotasResponse, void>({
      query: () => "/notas",
    }),

    //traer ntoas por id
    getNotasbyId: builder.query<NotaResponse, string>({
      query: (id) => `/notas/${id}`,
    }),

    //crear Notas
    createNotas: builder.mutation<NotaResponse, Partial<Nota>>({
      query: (Notas) => {
        console.log("🛠️ Enviando notas desde mutation:", Notas);
        return {
          url: "notas",
          method: "POST",
          body: Notas,
        };
      }
    }),

    // Actualizar Notas
    updateNotas: builder.mutation<NotaResponse, { id: string; data: Partial<Nota> }>({
      query: ({ id, data }) => {
        console.log("🛠️ Enviando Notas desde mutation:", data);
        return {
          url: `/notas/${id}`,
          method: "PUT",
          body: data,
        };
      },
    }),

    //agregar o editar nota
     createOrUpdateNota: builder.mutation<NotaResponse, {
      estudianteId: string;
      materiaId: string;
      bimestre: number;
      nota: number;
      docenteId: string;
    }>({
      query: (body) => ({
        url: "/notas",
        method: "POST",
        body,
      }),
    }),


  }),
});

// Hooks auto-generados
export const {
    useGetNotasQuery,
    useCreateNotasMutation,
    useUpdateNotasMutation, 
    useGetNotasbyIdQuery,
    useCreateOrUpdateNotaMutation
} = notasApi






