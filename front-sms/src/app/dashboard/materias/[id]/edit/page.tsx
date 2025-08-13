"use client"
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import { useParams } from 'next/navigation'
import React from 'react'
import NotFound from './not-found'
import { useGetMateriaByIdQuery } from '@/redux/services/materiasApi'
import { Loader2 } from 'lucide-react'
import FormEditarMateria from '@/components/materias/formEditarMateria'

const Page = () => {


    const params = useParams()
    const id = params.id as string

 if(!id){
    NotFound()
 } 

 const {data , isLoading, isError} = useGetMateriaByIdQuery(id)

 if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  
  if (isError) return <div>Usuario no encontrado</div>;


  const dataMateria = data?.data

  console.log("dataMateria", dataMateria) 

  if (!dataMateria || !dataMateria?.id) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  }


  return (
    <div className="container mx-auto py-10 px-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/materias" label="materias" page="Editar materias" />
        <div className="container mx-auto py-10 px-5">
            <FormEditarMateria dataMateria={dataMateria} />
        </div>
    </div>
  )
}

export default Page