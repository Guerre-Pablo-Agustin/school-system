"use client"
import InformacionDocente from '@/components/clases/informacionDocente'
import TablasAlumnosClases from '@/components/clases/tablasAlumnosClases'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import { useGetClasesbyIdQuery } from '@/redux/services/clasesApi'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

const Page = () => {

   const params = useParams()
   const id = params.id as string

   console.log("id", id)

   const {data , isLoading, isError} = useGetClasesbyIdQuery(id)

   if (!id) {
     return (
       <div>No se ha encontrado la clase</div>
     )
   }

      if (isLoading)
        return (
          <section className="container mx-auto py-10">
            <Loader2 className="mx-auto h-48 w-48 animate-spin" />
          </section>
        );
  
    if (isError) return <div>Usuario no encontrado</div>;

  console.log("data detalle clase", data)

  const claseData = data?.data
  const AlumnosClase = claseData?.estudiantes
  const docente = claseData?.docente
  const docenteId = claseData?.docenteId
  const materiaId = claseData?.materiaId

  if(!docente) return <div>No se encontro el docente</div>

  if(!docenteId) return <div className='text-red-500 container mx-auto py-10 px-5'>No se encontro datos del docente</div>
  if(!materiaId) return <div className='text-red-500 container mx-auto py-10 px-5'>No se encontro datos de la materia</div>

  return (
    <main className="container mx-auto py-10 px-5">
       <BreadcrumbWithCustomSeparator href="/dashboard/clases" label="clases" page="Informacion" />
       <section className="container mx-auto py-10 px-5">
       <InformacionDocente  docente={docente} />
       </section>
       <section className="container mx-auto py-10 px-5">
         <TablasAlumnosClases  AlumnosClase={AlumnosClase} docenteId={docenteId} materiaId={materiaId} />
       </section>
    </main>
  )
}

export default Page