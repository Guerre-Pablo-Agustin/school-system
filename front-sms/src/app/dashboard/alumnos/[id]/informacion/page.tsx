"use client";
import InformacionAlumno from '@/components/alumnos/informacionAlumno';
import TablasNotas from '@/components/alumnos/tablasNotas';
import { BreadcrumbWithCustomSeparator } from '@/components/ui/breadcrumbSeparator';
import { useGetAlumnobyIdQuery } from '@/redux/services/alumnosApi';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

const Page = () => {

  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError, refetch } = useGetAlumnobyIdQuery(id);

  if (isLoading)
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );

  if (isError) return <div>Usuario no encontrado</div>;

  const dataAlumno = data?.data;
  const dataNotas = dataAlumno?.notas;

  if (!dataAlumno?.id || !dataNotas) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="mx-auto h-48 w-48 animate-spin" />
      </section>
    );
  }

  return (
    <section className="container mx-auto py-10 px-5">
      <BreadcrumbWithCustomSeparator
        href="/dashboard/alumnos"
        label="alumnos"
        page="Informacion"
      />

      <div className="container mx-auto py-10 px-5">
        <InformacionAlumno dataAlumno={dataAlumno} />
      </div>

      <div className="container md:w-200 mx-auto py-10 px-5">
          <TablasNotas
            alumnoId={dataAlumno.id}
            dataNotas={dataNotas}
            onSaved={() => refetch()} // 🔄 después de guardar en la tabla
            alumnoNombre={dataAlumno.nombre}
          />
      </div>
    </section>
  );
};

export default Page;
