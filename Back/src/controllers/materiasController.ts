import { Request, Response } from "express";
import { Materia } from "../types/materia.types";
import { prisma } from "../lib/prisma";
import { Bimestre } from "../types/nota.type";

export const getMaterias = async (req: Request, res: Response) => {
  try {
    const materias = await prisma.materia.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        nombre: true,
        ciclo: true,
        codigo: true,
        docenteId: true,
      },
    });

    res.status(200).json({
      mensaje: "Listado de materias",
      data: materias,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener materias",
      error: error,
    });
  }
};

export const getMateria = async (req: Request, res: Response) => {
  const { codigo } = req.params;

  try {
    const materia = await prisma.materia.findUnique({
      where: {
        codigo,
      },
      select: {
        id: true,
        nombre: true,
        ciclo: true,
        codigo: true,
        docenteId: true,
      },
    });

    res.status(200).json({
      mensaje: "Materia encontrada",
      data: materia,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener materia",
      error: error,
    });
  }
};

export const createMateria = async (req: Request, res: Response) => {
  try {
    const { nombre, ciclo, codigo, docenteId } = req.body;

    // Validaciones mejoradas
    const requiredFields = ['nombre', 'ciclo', 'codigo', 'docenteId'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Campos requeridos faltantes",
        missingFields,
        details: "Todos los campos marcados son obligatorios"
      });
    }

    // Creación de la materia
    const newMateria = await prisma.materia.create({
      data: {
        nombre,
        ciclo,
        codigo,
        docenteId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Materia creada exitosamente",
      data: newMateria,
    });

  } catch (error) {
    console.error('Error en createMateria:', error);
    
    return res.status(500).json({
      error: "Error interno del servidor",
      ...(process.env.NODE_ENV === 'development' && {
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
    });
  }
};

export const updateMateria = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, ciclo, codigo, docenteId } = req.body;

  try {
    const updatedMateria = await prisma.materia.update({
      where: {
        id,
      },
      data: {
        nombre,
        ciclo,
        codigo,
        docenteId,
        },
      include: {
        notas: true,
      },
    });

    // Mapear bimestre a enum Bimestre si es necesario
    const materia: Materia = {
      ...updatedMateria,
      notas: updatedMateria.notas.map(nota => ({
        ...nota,
        bimestre: nota.bimestre as Bimestre
      }))
    };

    res.status(200).json({
      mensaje: "Materia actualizada exitosamente",
      data: materia,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar materia",
      error: error,
    });
  }
};

export const deleteMateria = async (req: Request, res: Response) => {
  const { id } = req.params;

  const materia = await prisma.materia.delete({
    where: {
      id,
    },
  });

  res.status(200).json(materia);
};  