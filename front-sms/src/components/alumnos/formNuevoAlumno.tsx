"use client"
import { useCreateAlumnoMutation } from '@/redux/services/alumnosApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const formAlumnoSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre es requerido" }),
  apellido: z.string().min(3, { message: "El apellido es requerido" }),
  dni: z.string().min(8, { message: "El dni es requerido" }),
  grado: z.string().min(1, { message: "El grado es requerido" }).max(2, { message: "El grado es requerido" }),
  seccion: z.string().min(1, { message: "El seccion es requerido" }).max(2, { message: "El seccion es requerido" }),
  telefono: z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-()]{7,20}$/, {
    message: "Número de teléfono inválido",
  }),
  direccion: z.string().min(3, { message: "La direccion es requerida" }),
});


const FormNuevoAlumno = () => {

    const router = useRouter();
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [createAlumno, { isLoading }] = useCreateAlumnoMutation();

    const form = useForm<z.infer<typeof formAlumnoSchema>>({
        resolver: zodResolver(formAlumnoSchema),
        defaultValues: {
            nombre: "",
            apellido: "",
            dni: "",
            grado: "",
            seccion: "",
            telefono: "",
            direccion: "",
        },
    });


    const handleSubmit = async (data: z.infer<typeof formAlumnoSchema>) => {
        try {
            const response = await createAlumno(data).unwrap();
            if (response) {
                setMensaje("Alumno creado correctamente");
                router.push("/dashboard/alumnos");
            } else {
                setMensaje("Error al crear el alumno");
            }
        } catch (error) {
            console.error("Error al crear alumno:", error);
            const errorMessage =
                (error as { data?: { error?: string } })?.data?.error ||
                "Error inesperado al crear el alumno.";
            setError(errorMessage);
        }
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormDescription>Nombre completo del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Apellido" {...field} />
                </FormControl>
                <FormDescription>Apellido del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DNI</FormLabel>
                <FormControl>
                  <Input placeholder="DNI" {...field} />
                </FormControl>
                <FormDescription>DNI del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="grado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grado</FormLabel>
                <FormControl>
                  <Input placeholder="Grado" {...field} />
                </FormControl>
                <FormDescription>Grado del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sección</FormLabel>
                <FormControl>
                  <Input placeholder="Sección" {...field} />
                </FormControl>
                <FormDescription>Sección del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefono</FormLabel>
                <FormControl>
                  <Input placeholder="Telefono" {...field} />
                </FormControl>
                <FormDescription>Telefono del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Direccion</FormLabel>
                <FormControl>
                  <Input placeholder="Direccion" {...field} />
                </FormControl>
                <FormDescription>Direccion del alumno.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Crear Alumno"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/alumnos")}
          >
            Cancelar
          </Button>
        </div>
      </form>

      {/* Alertas de estado */}
      <div className="mt-5 space-y-3">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mensaje && (
          <Alert className="border-green-200 ">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {mensaje}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Form> 
  )
}

export default FormNuevoAlumno