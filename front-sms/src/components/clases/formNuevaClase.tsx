"use client";
import { useGetUserByIdQuery } from '@/redux/services/authApi';
import { useCreateClaseMutation } from '@/redux/services/clasesApi';
import { useGetMateriasByCodigoQuery } from '@/redux/services/materiasApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import z from 'zod'
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
import { AlertCircle, CheckCircle2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

const formClaseSchema = z.object({
    docenteId: z.string().min(1, "Docente es requerido"),
    materiaId: z.string().min(1, "Materia es requerida"),
    anioLectivo: z.number().min(2000, "Año lectivo debe ser mayor a 2000").max(2100, "Año lectivo no válido"),
})

const FormNuevaClase = () => {
    const router = useRouter()
    const [createClase, { isLoading }] = useCreateClaseMutation()
    const [codigoMateriaBusqueda, setCodigoMateriaBusqueda] = useState("")
    const [docenteIdBusqueda, setDocenteIdBusqueda] = useState("")
    const [mensaje, setMensaje] = useState({
        error: "",
        success: "",
        materia: "",
        docente: "",
    })

    // hook para obtener datos de la materia
    const { data: MateriaData, isLoading: isLoadingMateria, isError: isErrorMateria, refetch: refetchMateria } = useGetMateriasByCodigoQuery(codigoMateriaBusqueda, {
        skip: !codigoMateriaBusqueda,
    })

    // hook para obtener datos del docente
    const { data: docenteData, isLoading: isLoadingDocente, isError: isErrorDocente, refetch: refetchDocente } = useGetUserByIdQuery(docenteIdBusqueda, {
        skip: !docenteIdBusqueda,
    })

    const form = useForm<z.infer<typeof formClaseSchema>>({
        resolver: zodResolver(formClaseSchema),
        defaultValues: {
            docenteId: "",
            materiaId: "",
            anioLectivo: new Date().getFullYear(),
        },
    });

    // Efecto para autocompletar materia cuando se encuentra
    useEffect(() => {
        if (MateriaData) {
            form.setValue('materiaId', MateriaData.data.id);
            setMensaje(prev => ({
                ...prev,
                materia: `Materia encontrada: ${MateriaData.data.nombre} (${MateriaData.data.codigo})`
            }));
        }
    }, [MateriaData, form]);

    // Efecto para autocompletar docente cuando se encuentra
    useEffect(() => {
        if (docenteData && docenteData.data.rol === 'DOCENTE') {
            form.setValue('docenteId', docenteData.data.id);
            setMensaje(prev => ({
                ...prev,
                docente: `Docente encontrado: ${docenteData.data.nombre} (${docenteData.data.email})`
            }));
        } else if (docenteData && docenteData.data.rol !== 'DOCENTE') {
            setMensaje(prev => ({
                ...prev,
                docente: "El usuario encontrado no es un docente"
            }));
        }
    }, [docenteData, form]);

    // Efecto para manejar errores de búsqueda
    useEffect(() => {
        if (isErrorMateria && codigoMateriaBusqueda) {
            setMensaje(prev => ({
                ...prev,
                materia: "Materia no encontrada. Verifica el código."
            }));
        }
    }, [isErrorMateria, codigoMateriaBusqueda]);

    useEffect(() => {
        if (isErrorDocente && docenteIdBusqueda) {
            setMensaje(prev => ({
                ...prev,
                docente: "Docente no encontrado. Verifica el ID."
            }));
        }
    }, [isErrorDocente, docenteIdBusqueda]);

    const handleSubmit = async (data: z.infer<typeof formClaseSchema>) => {
        try {
            const response = await createClase(data).unwrap();
            if (response) {
                setMensaje({
                    error: "",
                    success: "Clase creada correctamente",
                    materia: "",
                    docente: ""
                });
                setTimeout(() => router.push("/dashboard/clases"), 1500);
            }
        } catch (error) {
            console.error("Error al crear clase:", error);
            const errorMessage =
                (error as { data?: { error?: string } })?.data?.error ||
                "Error inesperado al crear la clase.";
            setMensaje({
                error: errorMessage,
                success: "",
                materia: "",
                docente: "",
            });
        }
    };

    const handleBuscarMateria = () => {
        if (codigoMateriaBusqueda.trim()) {
            refetchMateria();
            setMensaje(prev => ({ ...prev, materia: "Buscando materia..." }));
        }
    };

    const handleBuscarDocente = () => {
        if (docenteIdBusqueda.trim()) {
            refetchDocente();
            setMensaje(prev => ({ ...prev, docente: "Buscando docente..." }));
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Card para buscar materia */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5" />
                                Buscar Materia por Código
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className='flex gap-2'>
                                <Input
                                    placeholder="Ingresa el código de la materia (ej: MAT-5P)"
                                    value={codigoMateriaBusqueda}
                                    onChange={(e) => setCodigoMateriaBusqueda(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleBuscarMateria())}
                                />
                                <Button
                                    type="button"
                                    onClick={handleBuscarMateria}
                                    disabled={isLoadingMateria || !codigoMateriaBusqueda.trim()}
                                >
                                    {isLoadingMateria ? "Buscando..." : "Buscar"}
                                </Button>
                            </div>

                            {isLoadingMateria && (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            )}

                            {mensaje.materia && (
                                <Alert variant={isErrorMateria ? "destructive" : "default"} className="mt-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{mensaje.materia}</AlertDescription>
                                </Alert>
                            )}

                            {MateriaData && (
                                <div className="p-3 border rounded-lg bg-muted/50">
                                    <h4 className="font-semibold">Información de la Materia:</h4>
                                    <p><strong>Nombre:</strong> {MateriaData.data.nombre}</p>
                                    <p><strong>Código:</strong> {MateriaData.data.codigo}</p>
                                    <p><strong>Ciclo:</strong> {MateriaData.data.ciclo}</p>
                                    <p><strong>Grado:</strong> {MateriaData.data.grado}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Card para buscar docente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5" />
                                Buscar Docente por ID
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className='flex gap-2'>
                                <Input
                                    placeholder="Ingresa el ID del docente"
                                    value={docenteIdBusqueda}
                                    onChange={(e) => setDocenteIdBusqueda(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleBuscarDocente())}
                                />
                                <Button
                                    type="button"
                                    onClick={handleBuscarDocente}
                                    disabled={isLoadingDocente || !docenteIdBusqueda.trim()}
                                >
                                    {isLoadingDocente ? "Buscando..." : "Buscar"}
                                </Button>
                            </div>

                            {isLoadingDocente && (
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            )}

                            {mensaje.docente && (
                                <Alert variant={isErrorDocente ? "destructive" : "default"} className="mt-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{mensaje.docente}</AlertDescription>
                                </Alert>
                            )}

                            {docenteData && docenteData.data.rol === 'DOCENTE' && (
                                <div className="p-3 border rounded-lg bg-muted/50">
                                    <h4 className="font-semibold">Información del Docente:</h4>
                                    <p><strong>Nombre:</strong> {docenteData.data.nombre}</p>
                                    <p><strong>Email:</strong> {docenteData.data.email}</p>
                                    <p><strong>Teléfono:</strong> {docenteData.data.telefono || "No registrado"}</p>
                                    <p><strong>Rol:</strong> {docenteData.data.rol}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Campos del formulario (ocultos o visibles según prefieras) */}
                <div className="hidden">
                    <FormField
                        control={form.control}
                        name="materiaId"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="docenteId"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Campo de año lectivo */}
                <FormField
                    control={form.control}
                    name="anioLectivo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Año Lectivo</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="2024"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                            </FormControl>
                            <FormDescription>
                                Año académico de la clase
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={isLoading || !form.watch('materiaId') || !form.watch('docenteId')}
                        className="cursor-pointer"
                    >
                        {isLoading ? "Creando..." : "Crear Clase"}
                    </Button>
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => router.push("/dashboard/clases")}
                    >
                        Cancelar
                    </Button>
                </div>
            </form>

            {/* Alertas de estado */}
            <div className="mt-5 space-y-3">
                {mensaje.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{mensaje.error}</AlertDescription>
                    </Alert>
                )}

                {mensaje.success && (
                    <Alert className="">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                            {mensaje.success}
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </Form>
    )
}

export default FormNuevaClase;