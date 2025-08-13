import FormNuevoAlumno from '@/components/alumnos/formNuevoAlumno'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto py-10 px-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/alumnos" label="alumnos" page="Nuevo alumno" />
          <div className="container mx-auto py-10 px-5">
            <FormNuevoAlumno />
            </div>  
    </section>
  )
}

export default page