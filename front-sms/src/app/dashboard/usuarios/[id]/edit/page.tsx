"use client"
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import FormEditUsuario from '@/components/usuarios/formEditUsuario'
import { useGetUserByIdQuery } from '@/redux/services/authApi'
import { Loader2 } from 'lucide-react'
import { notFound, useParams } from 'next/navigation'
import React from 'react'

const Page = () => {

    const params = useParams()
    const id = params.id as string

 if(!id){
    notFound()
 } 

 const {data , isLoading, isError} = useGetUserByIdQuery(id)

 if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  
  if (isError) return <div>Usuario no encontrado</div>;


  const dataUser = data?.data

  console.log("dataUser", dataUser) 

  if (!dataUser || !dataUser.id) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  }
  
  return (
    <section className="container mx-auto px-10 py-5">
      <BreadcrumbWithCustomSeparator
        href="/dashboard/usuarios"
        label="usuarios"
        page="Editar usuarios"
      />
      <section className="container mx-auto py-10 px-5">
      <Card>
        <CardHeader>
          <CardTitle>Datos usuario</CardTitle>
        </CardHeader>
        <CardContent>
      <FormEditUsuario dataUser={dataUser} />
        </CardContent>
        </Card>
      </section>
    </section>
  );
}

export default Page