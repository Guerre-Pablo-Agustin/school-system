import FormNuevaClase from '@/components/clases/formNuevaClase'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import React from 'react'

const page = () => {
  return (
    <main className="container mx-auto py-10 px-5">
      <BreadcrumbWithCustomSeparator href="/dashboard/clases" label="Clases" page="Nueva"/>
      <section className="container mx-auto py-10 px-5">

      <FormNuevaClase />
      </section>

    </main>
  )
}

export default page