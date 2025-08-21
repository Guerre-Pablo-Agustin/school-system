import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./authApi";
import { Materia } from "../../../types/materia.types";


interface MateriasResponse {
  message: string;
  data: Materia[];
  error?: string;
}

interface MateriaResponse {
  message: string;
  data: Materia;
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
    getMateriasByCodigo: builder.query<MateriaResponse, string>({
      query: (codigo) => `/materias/codigo/${codigo}`,
    }),

    //traer materia por id
    getMateriaById: builder.query<MateriaResponse, string>({
      query: (id) => `/materias/id/${id}`,
    }),
    
    // Crear materia
   createMateria: builder.mutation<MateriasResponse, Partial<Materia>>({
    query:(data)=>{
      console.log("🛠️ Enviando materia desde mutation:",data); // 👈 log
      return {
        url:"materias",
        method:"POST",
        body:data,
      }
    },
  }),

    // Actualizar materia
   updateMateria: builder.mutation<MateriasResponse,{id:string,data:Partial<Materia>}>({
    query:({id,data})=>{
      console.log("🛠️ Enviando materia desde mutation:",data); // 👈 log
      return {
        url:`/materias/${id}`,
        method:"PUT",
        body:data,
      }
    },  
  }),
  }),
});

// Hooks auto-generados
export const {
  useGetMateriasQuery,
  useGetMateriaByIdQuery,
  useGetMateriasByCodigoQuery,
  useCreateMateriaMutation,
  useUpdateMateriaMutation,
} = materiasApi






