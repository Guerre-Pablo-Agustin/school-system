"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { useCreateMateriaMutation } from '@/redux/services/materiasApi';
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

const formMateriaSchema = z.object({
    nombre: z.string().min(3, { message: "El nombre es requerido" }),
    codigo: z.string().min(3, { message: "El codigo es requerido" }),
    ciclo: z.enum(["PRIMARIA", "SECUNDARIA"]),
});

const FormnuevaMateria = () => {
    const router = useRouter();
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");
    const [createMateria, { isLoading }] = useCreateMateriaMutation();

    const form = useForm<z.infer<typeof formMateriaSchema>>({
        resolver: zodResolver(formMateriaSchema),
        defaultValues: {
            nombre: "",
            codigo: "",
            ciclo: "PRIMARIA",
        },
    });

    const handleSubmit = async (data: z.infer<typeof formMateriaSchema>) => {
        try {
            const response = await createMateria(data).unwrap();
            if (response) {
                setMensaje("Materia creada correctamente");
                router.push("/dashboard/materias");
            } else {
                setMensaje("Error al crear la materia");
            }
        } catch (error) {
            console.error("Error al crear materia:", error);
            const errorMessage =
                (error as { data?: { error?: string } })?.data?.error ||
                "Error inesperado al crear la materia.";
            setError(errorMessage);
        }
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="flex flex-col gap-6">
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
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleccione el ciclo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel></SelectLabel>
                                            <SelectItem value="PRIMARIA">PRIMARIA</SelectItem>
                                            <SelectItem value="SECUNDARIA">SECUNDARIA</SelectItem>

                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex gap-4">
                    <Button type="submit" disabled={isLoading} className="cursor-pointer">
                        {isLoading ? "Guardando..." : "Crear Materia"}
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

export default FormnuevaMateria;