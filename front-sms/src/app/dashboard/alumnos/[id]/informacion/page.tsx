"use client"
import InformacionAlumno from '@/components/alumnos/informacionAlumno'
import TablasNotas from '@/components/alumnos/tablasNotas'
import FormAgregarNota from '@/components/alumnos/formAgregarNota'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import { useGetAlumnobyIdQuery } from '@/redux/services/alumnosApi'
import { Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

const Page = () => {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const params = useParams()
    const id = params.id as string

    const {data , isLoading, isError} = useGetAlumnobyIdQuery(id)

    if (isLoading)
        return (
          <section className="container mx-auto py-10">
            <Loader2 className="mx-auto h-48 w-48 animate-spin" />
          </section>
        );
  
    if (isError) return <div>Usuario no encontrado</div>;

 const dataAlumno = data?.data
 const dataNotas = dataAlumno?.notas

  if (!dataAlumno || !dataAlumno?.id) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  }


 console.log("dataNotas", dataNotas)


  return (
    <section className="container mx-auto py-10 px-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/alumnos" label="alumnos" page="Informacion" />
        <div className="container mx-auto py-10 px-5">
         <InformacionAlumno dataAlumno={dataAlumno} />   
        </div>
        <div className="container mx-auto py-10 px-5">
            {mostrarFormulario ? (
              <FormAgregarNota
                alumnoId={dataAlumno?.id || ""}
                onNotaAgregada={() => {
                  setMostrarFormulario(false);
                  // Refetch data para actualizar la tabla
                  window.location.reload();
                }}
                onCancelar={() => setMostrarFormulario(false)}
              />
            ) : (
              <TablasNotas 
                dataNotas={dataNotas} 
                onAgregarNota={() => setMostrarFormulario(true)} 
              />
            )}
        </div>
    </section>
  )
}

export default Page