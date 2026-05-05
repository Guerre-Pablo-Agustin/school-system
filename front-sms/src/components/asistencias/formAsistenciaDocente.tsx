"use client";
import { useCreateAsistenciaDocenteMutation, useGetAsistenciasDocenteQuery } from "@/redux/services/asistenciasApi";
import { useGetAlumnosQuery } from "@/redux/services/alumnosApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EstadoAsistencia } from "../../../types/asistencia.type";

const formAsistenciaDocenteSchema = z.object({
  fecha: z.string().min(1, { message: "La fecha es requerida" }),
  docenteId: z.string().min(1, { message: "El docente es requerido" }),
  estado: z.string().min(1, { message: "El estado es requerido" }),
});

const estadosAsistencia: { value: EstadoAsistencia; label: string }[] = [
  { value: "PRESENTE", label: "Presente" },
  { value: "AUSENTE", label: "Ausente" },
  { value: "TARDANZA", label: "Tardanza" },
  { value: "JUSTIFICADO", label: "Justificado" },
];

const FormAsistenciaDocente = () => {
  const router = useRouter();
  const [mensaje, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createAsistencia, { isLoading }] = useCreateAsistenciaDocenteMutation();
  const { data: docentesData, isLoading: isLoadingDocentes } = useGetAlumnosQuery();

  const form = useForm<z.infer<typeof formAsistenciaDocenteSchema>>({
    resolver: zodResolver(formAsistenciaDocenteSchema),
    defaultValues: {
      fecha: new Date().toISOString().split("T")[0],
      docenteId: "",
      estado: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formAsistenciaDocenteSchema>) {
    try {
      setError("");
      setMessage("");

      const response = await createAsistencia({
        fecha: values.fecha,
        estado: values.estado as EstadoAsistencia,
        docenteId: Number(values.docenteId),
      }).unwrap();

      if (response) {
        setMessage("Asistencia registrada correctamente");
        setTimeout(() => {
          router.push("/dashboard/asistencias");
        }, 1500);
      } else {
        setMessage("Error al registrar la asistencia");
      }
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Error inesperado al registrar la asistencia.";
      setError(errorMessage);
    }
  }

  if (isLoadingDocentes) {
    return (
      <section className="container mx-auto py-10">
        <Loader2 className="animate-spin h-48 w-48 mx-auto" />
      </section>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>Fecha de la asistencia.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="docenteId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Docente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un docente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {docentesData?.data?.map((docente) => (
                      <SelectItem key={docente.id} value={String(docente.id)}>
                        {docente.nombre} {docente.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Docente para registrar asistencia.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {estadosAsistencia.map((estado) => (
                      <SelectItem key={estado.value} value={estado.value}>
                        {estado.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Estado de la asistencia.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Registrar Asistencia"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/asistencias")}
          >
            Cancelar
          </Button>
        </div>
      </form>

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
  );
};

export default FormAsistenciaDocente;
