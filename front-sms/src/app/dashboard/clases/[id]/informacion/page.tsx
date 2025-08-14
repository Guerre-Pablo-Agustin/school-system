"use client"
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

  return (
    <div>
       <BreadcrumbWithCustomSeparator href="/dashboard/clases" label="clases" page="Informacion" />
    </div>
  )
}

export default Page