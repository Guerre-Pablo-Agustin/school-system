"use client";
import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreateOrUpdateNotaMutation } from "@/redux/services/notasApi";
import { NotaParcial } from "../../../types/nota.type";

interface AlumnoClase {
    id: string;
    nombre: string;
    apellido: string;
    grado: string;
    seccion: string;
    notas: NotaParcial[];
    promedio: number | null;
}

interface TablasAlumnosClasesProps {
    AlumnosClase: AlumnoClase[] | undefined;
    docenteId: string;
    materiaId: string;
    claseId: string;
}

const TablasAlumnosClases = ({
    AlumnosClase,
    docenteId,
    materiaId,
    claseId,
}: TablasAlumnosClasesProps) => {
    const [createOrUpdateNota] = useCreateOrUpdateNotaMutation();

    // fila en edición
    const [editandoId, setEditandoId] = useState<string | null>(null);
    // notas locales para edición
    const [editNotas, setEditNotas] = useState<Record<string, Record<number, string>>>({});
    const [alumnos, setAlumnos] = useState(AlumnosClase ?? []);

    useEffect(() => {
        if (AlumnosClase) setAlumnos(AlumnosClase);
    }, [AlumnosClase]);


    if (!AlumnosClase || AlumnosClase.length === 0) {
        return <p>No hay alumnos en esta clase</p>;
    }

    const handleNotaChange = (
        alumnoId: string,
        bimestre: number,
        value: string
    ) => {
        setEditNotas((prev) => ({
            ...prev,
            [alumnoId]: {
                ...prev[alumnoId],
                [bimestre]: value,
            },
        }));
    };



    const handleGuardarFila = async (alumnoId: string) => {
        const notasDelAlumno = editNotas[alumnoId];
        if (!notasDelAlumno) return;

        try {
            for (const [bimestreStr, valor] of Object.entries(notasDelAlumno)) {
                const bimestre = parseInt(bimestreStr, 10);
                const notaNum = parseFloat(valor);

                await createOrUpdateNota({
                    estudianteId: alumnoId,
                    materiaId,
                    bimestre,
                    valor: notaNum,
                    docenteId,
                    claseId,
                }).unwrap();

                // 🔥 actualizar en memoria
                setAlumnos((prev) =>
                    prev.map((a) =>
                        a.id === alumnoId
                            ? {
                                ...a,
                                notas: [
                                    ...a.notas.filter((n) => n.bimestre !== bimestre),
                                    { bimestre, valor: notaNum },
                                ],
                            }
                            : a
                    )
                );
            }

            toast.success("Notas guardadas correctamente");
            setEditandoId(null);
            setEditNotas((prev) => {
                const nuevo = { ...prev };
                delete nuevo[alumnoId];
                return nuevo;
            });
        } catch (error) {
            console.error(error);
            toast.error("Error al guardar las notas");
        }
    };

    return (
        <div className="p-4  rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Lista de Alumnos</h2>
            <Table>
                <TableCaption>Notas de los alumnos de la clase</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Grado</TableHead>
                        <TableHead>Sección</TableHead>
                        <TableHead>1° Bimestre</TableHead>
                        <TableHead>2° Bimestre</TableHead>
                        <TableHead>3° Bimestre</TableHead>
                        <TableHead>4° Bimestre</TableHead>
                        <TableHead>Promedio</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {alumnos.map((alumno) => {
                        const estaEditando = editandoId === alumno.id;

                        return (
                            <TableRow key={alumno.id}>
                                <TableCell>{alumno.nombre} {alumno.apellido}</TableCell>
                                <TableCell>{alumno.grado}</TableCell>
                                <TableCell>{alumno.seccion}</TableCell>
                                {[1, 2, 3, 4].map((bimestre) => {
                                    const notaExistente = alumno.notas.find(
                                        (n) => n.bimestre === bimestre
                                    );
                                    const valorLocal = editNotas[alumno.id]?.[bimestre] ?? "";

                                    return (
                                        <TableCell key={bimestre}>
                                            {estaEditando ? (
                                                <Input
                                                    type="number"
                                                    step="0.1"
                                                    min="1"
                                                    max="10"
                                                    className="w-20"
                                                    value={
                                                        valorLocal !== ""
                                                            ? valorLocal
                                                            : notaExistente?.valor?.toString() ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        handleNotaChange(alumno.id, bimestre, e.target.value)
                                                    }
                                                />
                                            ) : (
                                                <span>{notaExistente?.valor ?? "-"}</span>
                                            )}
                                        </TableCell>
                                    );
                                })}
                                <TableCell>{alumno.promedio ?? "-"}</TableCell>
                                <TableCell>
                                    {estaEditando ? (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleGuardarFila(alumno.id)}
                                                className="cursor-pointer"
                                            >
                                                Guardar
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="cursor-pointer"
                                                onClick={() => setEditandoId(null)}
                                            >
                                                Cancelar
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="cursor-pointer"
                                            onClick={() => setEditandoId(alumno.id)}
                                        >
                                            Editar
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default TablasAlumnosClases;
