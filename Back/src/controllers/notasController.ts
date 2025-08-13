import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * Obtener una nota por ID
 */
export const getNotaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const nota = await prisma.nota.findUnique({
      where: { id },
      include: {
        estudiante: true,
        materia: true,
      },
    });

    if (!nota) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    res.json(nota);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la nota", error });
  }
};

/**
 * Crear una nueva nota
 */
export const createNota = async (req: Request, res: Response) => {
  const { estudianteId, materiaId, bimestre, nota, docenteId } = req.body;

  try {
    // Validar duplicado según @@unique
    const existe = await prisma.nota.findUnique({
      where: {
        estudianteId_materiaId_bimestre: {
          estudianteId,
          materiaId,
          bimestre,
        },
      },
    });

    if (existe) {
      return res.status(400).json({
        message: "Ya existe una nota para este estudiante, materia y bimestre",
      });
    }

    const nuevaNota = await prisma.nota.create({
      data: {
        estudianteId,
        materiaId,
        bimestre,
        nota,
        docenteId,
      },
    });

    res.status(201).json({
      message: "Nota creada correctamente",
      data: nuevaNota,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la nota", error });
  }
};

/**
 * Actualizar una nota por ID
 */
export const updateNota = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nota } = req.body;

  try {
    const existe = await prisma.nota.findUnique({ where: { id } });

    if (!existe) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    const notaActualizada = await prisma.nota.update({
      where: { id },
      data: { nota },
    });

    res.json(notaActualizada);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la nota", error });
  }
};

/**
 * Eliminar una nota por ID
 */
export const deleteNota = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existe = await prisma.nota.findUnique({ where: { id } });

    if (!existe) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    await prisma.nota.delete({ where: { id } });

    res.json({ message: "Nota eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la nota", error });
  }
};
