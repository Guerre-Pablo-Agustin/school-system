import React from 'react'
import { User } from '../../../types/Usuario.type'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

interface InformacionDocenteProps {
  docente: User
}

const InformacionDocente = ({ docente }: InformacionDocenteProps) => {



  return (
    <Card className="h-full w-full">
      <CardHeader> 
        <CardTitle>Información del Docente</CardTitle>
     </CardHeader>
      <CardContent>
       <p>Nombre: {docente.nombre}</p>
       <p>Email: {docente.email}</p>
       <p>Telefono: {docente.telefono}</p>
       <p>Dirección: {docente.direccion}</p>
      </CardContent>
    </Card>
  )
}

export default InformacionDocente