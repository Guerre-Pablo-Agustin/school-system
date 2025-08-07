"use client"
import { selectUserLogin } from '@/redux/features/userSlice'
import React from 'react'
import { useSelector } from 'react-redux'
import { DataTable } from './data-table'
import { getColumns } from './columns'

const MainMisClases = () => {

    const userLogin = useSelector(selectUserLogin)

    const data = userLogin?.clases

    console.log("data clases", data)

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={getColumns()} data={data!} />
    </div>
  )
}

export default MainMisClases