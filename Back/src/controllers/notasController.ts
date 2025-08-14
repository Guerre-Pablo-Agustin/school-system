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
export const createOrUpdateNota = async (req: Request, res: Response) => {
  const { estudianteId, materiaId, bimestre, nota, docenteId } = req.body;

  try {
    // Buscar si ya existe una nota para este estudiante, materia y bimestre
    const notaExistente = await prisma.nota.findUnique({
      where: {
        estudianteId_materiaId_bimestre: {
          estudianteId,
          materiaId,
          bimestre,
        },
      },
    });

    if (notaExistente) {
      // Si existe, actualizarla
      const notaActualizada = await prisma.nota.update({
        where: { id: notaExistente.id },
        data: { nota },
      });

      return res.status(200).json({
        message: "Nota actualizada correctamente",
        data: notaActualizada,
        action: "updated",
        existingData: {
          id: notaExistente.id,
          notaActual: notaExistente.nota
        }
      });
    }

    // Si no existe, crear nueva
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
      action: "created"
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al procesar la nota", 
      error: error
    });
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
