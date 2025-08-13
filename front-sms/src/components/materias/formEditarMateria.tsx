import React, { useState } from 'react'
import { Materia } from '../../../types/materia.types';
import { useRouter } from 'next/navigation';
import { useUpdateMateriaMutation } from '@/redux/services/materiasApi';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from 'react-hook-form';

interface FormEditarMateriaProps {
  dataMateria: Materia;
}


const formMateriaSchema = z.object({
    nombre: z.string().min(3, { message: "El nombre es requerido" }),
    codigo: z.string().min(3, { message: "El codigo es requerido" }),
    ciclo: z.enum(["PRIMARIA", "SECUNDARIA"]),
});

const FormEditarMateria = ({ dataMateria }: FormEditarMateriaProps) => {

      const router = useRouter();
    const [updateProductApi, { isLoading }] = useUpdateMateriaMutation();
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

       const form = useForm<z.infer<typeof formMateriaSchema>>({
        resolver: zodResolver(formMateriaSchema),
        defaultValues: {
            nombre: dataMateria?.nombre || "",
            codigo: dataMateria?.codigo || "",
            ciclo: dataMateria?.ciclo || "PRIMARIA",
        },
    });

    const handlerEdit = async (values: z.infer<typeof formMateriaSchema>) => {
        if(!dataMateria?.id){
            setError("Materia no encontrada");
            return;
        }

        // Limpiar mensajes previos
        setError("");
        setMensaje("");

        try {
            const response = await updateProductApi({
                id: dataMateria.id,
                data: values
            }).unwrap();
            
            if (response) {
                setMensaje("Materia actualizada correctamente");
                router.push("/dashboard/materias");
            } else {
                setError("Error al actualizar la materia");
            }
        } catch (error: unknown) {
            console.error("Error al actualizar materia:", error);
            
            // Asegurar que siempre sea un string
            let errorMessage = "Error inesperado al actualizar la materia.";
            
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error && typeof error === 'object' && 'data' in error) {
                const errorData = error.data as { error?: string; message?: string };
                if (errorData?.error && typeof errorData.error === 'string') {
                    errorMessage = errorData.error;
                } else if (errorData?.message && typeof errorData.message === 'string') {
                    errorMessage = errorData.message;
                }
            } else if (error && typeof error === 'object' && 'message' in error) {
                const errorObj = error as { message: string };
                if (typeof errorObj.message === 'string') {
                    errorMessage = errorObj.message;
                }
            }
            
            setError(errorMessage);
        }
    };

  return (
   <Form     {...form}>
      <form onSubmit={form.handleSubmit(handlerEdit)} className="space-y-6">
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
                <FormDescription>Nombre de la materia.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="codigo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="Código" {...field} />
                </FormControl>
                <FormDescription>Código de la materia.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ciclo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciclo</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona el ciclo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel></SelectLabel>
                        <SelectItem value="PRIMARIA">PRIMARIA</SelectItem>
                        <SelectItem value="SECUNDARIA">SECUNDARIA</SelectItem>

                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>Ciclo de la materia.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="cursor-pointer">
            {isLoading ? "Guardando..." : "Actualizar Materia"}
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => router.push("/dashboard/materias")}
          >
            Cancelar
          </Button>
        </div>
      </form>

      {/* Alertas de estado */}      
      <div className="mt-5 space-y-3">
        {error && typeof error === 'string' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mensaje && typeof mensaje === 'string' && (
          <Alert variant="default">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              {mensaje}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Form>
  );
}

export default FormEditarMateria