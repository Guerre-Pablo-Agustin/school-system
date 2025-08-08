import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import MainAllUsuarios from '@/components/usuarios/allUsuarios/main'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/maestros" label="Maestros" page="Listado de maestros" />
            <MainAllUsuarios />
    </section>
  )
}

export default page