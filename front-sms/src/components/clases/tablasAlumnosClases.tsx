"use client";
import React, { useState } from "react";
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
import { Nota } from "../../../types/nota.type";

interface AlumnoClase {
    id: string;
    nombre: string;
    apellido: string;
    grado: string;
    seccion: string;
    notas: Nota[];
    promedio: number | null;
}

interface TablasAlumnosClasesProps {
    AlumnosClase: AlumnoClase[] | undefined;
    docenteId: string;
    materiaId: string;
}

const TablasAlumnosClases = ({
    AlumnosClase,
    docenteId,
    materiaId,
}: TablasAlumnosClasesProps) => {
    const [createOrUpdateNota] = useCreateOrUpdateNotaMutation();

    // Estado local para edición de notas en tabla
    const [editNotas, setEditNotas] = useState<Record<string, Record<number, string>>>({});

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

    const handleGuardar = async (alumnoId: string, bimestre: number) => {
        const valor = editNotas[alumnoId]?.[bimestre];
        if (!valor) return;

        const notaNum = parseFloat(valor);
        if (isNaN(notaNum) || notaNum < 1 || notaNum > 10) {
            toast.error("La nota debe estar entre 1 y 10");
            return;
        }

        try {
            const result = await createOrUpdateNota({
                estudianteId: alumnoId,
                materiaId,
                bimestre,
                nota: notaNum,
                docenteId,
            }).unwrap();

            if (result.action === "updated") {
                toast.success("Nota actualizada correctamente");
            } else {
                toast.success("Nota agregada correctamente");
            }

            // limpiar estado local para esa celda
            setEditNotas((prev) => {
                const updated = { ...prev };
                delete updated[alumnoId][bimestre];
                return updated;
            });
        } catch (error) {
            console.error("Error al guardar nota:", error);
            toast.error("Error al guardar la nota");
        }
    };

    return (
        <div className="p-4 border rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Lista de Alumnos</h2>
            <Table>
                <TableCaption>Notas de los alumnos de la clase</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Apellido</TableHead>
                        <TableHead>Grado</TableHead>
                        <TableHead>Sección</TableHead>
                        <TableHead>1° Bimestre</TableHead>
                        <TableHead>2° Bimestre</TableHead>
                        <TableHead>3° Bimestre</TableHead>
                        <TableHead>4° Bimestre</TableHead>
                        <TableHead>Promedio</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {AlumnosClase.map((alumno) => (
                        <TableRow key={alumno.id}>
                            <TableCell>{alumno.nombre}</TableCell>
                            <TableCell>{alumno.apellido}</TableCell>
                            <TableCell>{alumno.grado}</TableCell>
                            <TableCell>{alumno.seccion}</TableCell>
                            {[1, 2, 3, 4].map((bimestre) => {
                                const notaExistente = alumno.notas.find(
                                    (n) => n.bimestre === bimestre
                                );
                                const valorLocal = editNotas[alumno.id]?.[bimestre] ?? "";

                                return (
                                    <TableCell key={bimestre}>
                                        <div className="flex gap-2 items-center">
                                            <Input
                                                type="number"
                                                step="0.1"
                                                min="1"
                                                max="10"
                                                className="w-20"
                                                value={
                                                    valorLocal !== ""
                                                        ? valorLocal
                                                        : notaExistente?.nota?.toString() ?? ""
                                                }
                                                onChange={(e) =>
                                                    handleNotaChange(alumno.id, bimestre, e.target.value)
                                                }
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => handleGuardar(alumno.id, bimestre)}
                                                disabled={!valorLocal}
                                            >
                                                Guardar
                                            </Button>
                                        </div>
                                    </TableCell>
                                );
                            })}
                            <TableCell>{alumno.promedio ?? "-"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default TablasAlumnosClases;
