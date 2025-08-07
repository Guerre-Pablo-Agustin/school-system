
import MainMisClases from '@/components/clases/mis-clases/main'
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import React from 'react'

const page = () => {
  return (
    <section className="container mx-auto px-10 py-5">
        <BreadcrumbWithCustomSeparator href="/dashboard/clases" label="Clases" page="Mis Clases" />
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Mis Clases</h1>
            <MainMisClases />
        </div>
    </section>
  )
}

export default page