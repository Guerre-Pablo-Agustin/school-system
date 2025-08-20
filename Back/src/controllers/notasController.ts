import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * 
onbtener todas las notas
 */




/**
 * Obtener una nota por ID
 */
export const getNotaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const nota = await prisma.nota.findUnique({
      where: { id },
      include: {
        estudiante: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            grado: true,
            seccion: true
          }
        },
        materia: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
            ciclo: true
          }
        },
        docente: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        },
        clase: {
          select: {
            id: true,
            anioLectivo: true
          }
        }
      },
    });

    if (!nota) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    res.json(nota);
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener la nota", 
      error: error instanceof Error ? error.message : error 
    });
  }
};

/**
 * Crear o actualizar una nota
 */
export const createOrUpdateNota = async (req: Request, res: Response) => {
  const { estudianteId, materiaId, claseId, bimestre, valor, docenteId } = req.body;

  try {
    // Validar campos requeridos
    const requiredFields = ['estudianteId', 'materiaId', 'bimestre', 'valor', 'docenteId'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Campos requeridos faltantes",
        missingFields
      });
    }

    // Verificar que el bimestre sea válido (1-4)
    if (bimestre < 1 || bimestre > 4) {
      return res.status(400).json({
        message: "El bimestre debe estar entre 1 y 4"
      });
    }

    // Verificar que la nota esté en rango válido (0-20)
    if (valor < 0 || valor > 20) {
      return res.status(400).json({
        message: "La nota debe estar entre 0 y 20"
      });
    }

    let notaExistente;

    // Buscar nota existente basado en si hay claseId o no
    if (claseId) {
      // Buscar con claseId
      notaExistente = await prisma.nota.findUnique({
        where: {
          estudianteId_materiaId_bimestre_claseId: {
            estudianteId,
            materiaId,
            bimestre,
            claseId,
          },
        },
      });
    } else {
      // Buscar sin claseId
      notaExistente = await prisma.nota.findFirst({
        where: {
          estudianteId,
          materiaId,
          bimestre,
          claseId: null,
        },
      });
    }

    if (notaExistente) {
      // Si existe, actualizarla
      const notaActualizada = await prisma.nota.update({
        where: { id: notaExistente.id },
        data: { valor },
        include: {
          estudiante: {
            select: {
              nombre: true,
              apellido: true
            }
          },
          materia: {
            select: {
              nombre: true
            }
          }
        }
      });

      return res.status(200).json({
        message: "Nota actualizada correctamente",
        data: notaActualizada,
        action: "updated",
      });
    }

    // Si no existe, crear nueva
    const nuevaNota = await prisma.nota.create({
      data: {
        estudianteId,
        materiaId,
        claseId: claseId || null,
        bimestre,
        valor,
        docenteId,
      },
      include: {
        estudiante: {
          select: {
            nombre: true,
            apellido: true
          }
        },
        materia: {
          select: {
            nombre: true
          }
        }
      }
    });

    res.status(201).json({
      message: "Nota creada correctamente",
      data: nuevaNota,
      action: "created"
    });
  } catch (error) {
    console.error("Error al procesar la nota:", error);
    res.status(500).json({ 
      message: "Error al procesar la nota", 
      error: error instanceof Error ? error.message : error
    });
  }
};

/**
 * Actualizar una nota por ID
 */
export const updateNota = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { valor } = req.body;

  try {
    // Validar que la nota esté en rango válido
    if (valor !== undefined && (valor < 0 || valor > 20)) {
      return res.status(400).json({
        message: "La nota debe estar entre 0 y 20"
      });
    }

    const existe = await prisma.nota.findUnique({ 
      where: { id },
      include: {
        estudiante: {
          select: {
            nombre: true,
            apellido: true
          }
        }
      }
    });

    if (!existe) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    const notaActualizada = await prisma.nota.update({
      where: { id },
      data: { valor },
      include: {
        estudiante: {
          select: {
            nombre: true,
            apellido: true
          }
        },
        materia: {
          select: {
            nombre: true
          }
        }
      }
    });

    res.json({
      message: "Nota actualizada correctamente",
      data: notaActualizada
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al actualizar la nota", 
      error: error instanceof Error ? error.message : error 
    });
  }
};

/**
 * Eliminar una nota por ID
 */
export const deleteNota = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existe = await prisma.nota.findUnique({ 
      where: { id },
      include: {
        estudiante: {
          select: {
            nombre: true,
            apellido: true
          }
        }
      }
    });

    if (!existe) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    await prisma.nota.delete({ where: { id } });

    res.json({ 
      message: "Nota eliminada correctamente",
      data: {
        estudiante: existe.estudiante.nombre + " " + existe.estudiante.apellido,
        bimestre: existe.bimestre,
        valor: existe.valor
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al eliminar la nota", 
      error: error instanceof Error ? error.message : error 
    });
  }
};

/**
 * Obtener notas por estudiante y materia (opcionalmente por clase)
 */
export const getNotasByEstudianteMateria = async (req: Request, res: Response) => {
  const { estudianteId, materiaId, claseId } = req.query;

  try {
    if (!estudianteId || !materiaId) {
      return res.status(400).json({
        message: "estudianteId y materiaId son requeridos"
      });
    }

    const whereClause: any = {
      estudianteId: estudianteId as string,
      materiaId: materiaId as string,
    };

    if (claseId) {
      whereClause.claseId = claseId as string;
    }

    const notas = await prisma.nota.findMany({
      where: whereClause,
      include: {
        materia: {
          select: {
            nombre: true,
            codigo: true
          }
        },
        clase: {
          select: {
            anioLectivo: true
          }
        }
      },
      orderBy: [
        { bimestre: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    // Calcular promedio
    const promedio = notas.length > 0 
      ? notas.reduce((sum, nota) => sum + nota.valor, 0) / notas.length 
      : 0;

    res.json({
      data: notas,
      promedio: Math.round(promedio * 100) / 100,
      totalNotas: notas.length
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error al obtener las notas", 
      error: error instanceof Error ? error.message : error 
    });
  }
};