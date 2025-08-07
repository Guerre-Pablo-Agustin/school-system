"use client"
import { selectUserLogin } from '@/redux/features/userSlice'
import React from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from './data-table'
import { getColumns } from './columns'
import { useGetClasesByDocenteQuery } from '@/redux/services/clasesApi'
import { Loader2 } from 'lucide-react'

const MainMisClases = () => {

    const userLogin = useSelector(selectUserLogin)

   const { data, isLoading, isError } = useGetClasesByDocenteQuery(userLogin?.id)


   

   if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="text-primary mx-auto mb-5 h-48 w-48 animate-spin" />
      </section>
    );
  if (isError) return <p>Error al cargar las clases.</p>;


  console.log("data clases", data?.data)

  const clases = data?.data

  return (
    <div className="container mx-auto px-5 py-10 w-screen">
      <DataTable columns={getColumns()} data={clases!} />
    </div>
  )
}

export default MainMisClases