import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAll = async (req: Request, res: Response) => {
  try {
    const clases = await prisma.clase.findMany({
      include: {
        docente: {
          select: {
            nombre: true,
            email: true,
          },
        },
        materia: {
          select: {
            nombre: true,
            codigo: true,
            ciclo: true,
          },
        },
        estudiantes: {
          include: { 
            estudiante: { 
              select: {
                id: true,
                nombre: true,
                apellido: true,
                grado: true,
                seccion: true,
              },
            },
          },
        },
      },
    });

    // ✅ Opcional: Transformar la respuesta para que sea más clara
    const clasesTransformadas = clases.map(clase => ({
      ...clase,
      estudiantes: clase.estudiantes.map(inscripcion => inscripcion.estudiante)
    }));

    res.status(200).json({
      mensaje: "Clases obtenidas exitosamente",
      data: clasesTransformadas,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener clases",
      error: error,
    });
  }
};

// 1. GET BY ID 
export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const clase = await prisma.clase.findUnique({
      where: { id },
      include: {
        materia: true,
        docente: {
          select: { nombre: true, email: true },
        },
        estudiantes: {
          include: {
            estudiante: true
          }
        },
      },
    });

    if (!clase) {
      return res.status(404).json({ mensaje: "Clase no encontrada" });
    }

    // 2) Traigo las notas de los estudiantes para esta materia
    const estudiantesConNotas = await Promise.all(
      clase.estudiantes.map(async (inscripcion) => {
        const notas = await prisma.nota.findMany({
          where: {
            estudianteId: inscripcion.estudianteId,
            materiaId: clase.materiaId,
            claseId: clase.id
          },
          select: {
            bimestre: true,
            valor: true, 
            createdAt: true,
          },
          orderBy: { bimestre: "asc" },
        });

        const promedio = notas.length > 0
          ? notas.reduce((sum, nota) => sum + nota.valor, 0) / notas.length
          : null;

        return {
          ...inscripcion.estudiante,
          notas,
          promedio
        };
      })
    );

    res.status(200).json({
      mensaje: "Clase encontrada",
      data: {
        ...clase,
        estudiantes: estudiantesConNotas
      },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener la clase",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// 2. GET BY DOCENTE - Ya está correcto
export const getByDocente = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const clases = await prisma.clase.findMany({
      where: {
        docenteId: id,
      },
      include: {
        materia: {
          select: {
            nombre: true,
            codigo: true,
            ciclo: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      mensaje: "Clases obtenidas exitosamente",
      data: clases,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener clases",
      error: error,
    });
  }
};

// 3. CREATE CLASS - Agregar año lectivo
export const createClass = async (req: Request, res: Response) => {
  const { docenteId, materiaId, anioLectivo } = req.body;
  
  console.log("Datos recibidos para crear clase:", req.body);

  try {
    // Verificar si ya existe la clase para evitar duplicados
    const claseExistente = await prisma.clase.findFirst({
      where: {
        docenteId,
        materiaId,
        anioLectivo: anioLectivo || new Date().getFullYear()
      }
    });

    if (claseExistente) {
      return res.status(400).json({
        mensaje: "Ya existe una clase con este docente y materia para este año"
      });
    }

    const newClass = await prisma.clase.create({
      data: {
        docenteId,
        materiaId,
        anioLectivo: anioLectivo || new Date().getFullYear()
      },
    });

    res.status(201).json({
      mensaje: "Clase creada exitosamente",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear clase",
      error: error,
    });
  }
};

// 4. UPDATE CLASS - Corregido
export const updateClass = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { docenteId, materiaId, anioLectivo } = req.body;
  
  try {
    const updatedClass = await prisma.clase.update({
      where: { id },
      data: {
        docenteId,
        materiaId,
        anioLectivo
      },
      include: {
        materia: {
          select: {
            nombre: true,
            codigo: true,
            ciclo: true,
          },
        },
        docente: {
          select: {
            nombre: true,
            email: true
          }
        }
      },
    });

    res.status(200).json({
      mensaje: "Clase actualizada exitosamente",
      data: updatedClass,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar clase",
      error: error,
    });
  }
};

// 5. DELETE CLASS - Corregido (estaba eliminando usuario)
export const deleteClass = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Primero eliminar las inscripciones (relaciones muchos-a-muchos)
    await prisma.claseEstudiante.deleteMany({
      where: { claseId: id }
    });

    // Luego eliminar las notas asociadas a la clase
    await prisma.nota.deleteMany({
      where: { claseId: id }
    });

    // Finalmente eliminar la clase
    const clase = await prisma.clase.delete({
      where: { id }
    });

    res.status(200).json({
      mensaje: "Clase eliminada exitosamente",
      data: clase
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar clase",
      error: error,
    });
  }
};

// 6. ADD ALUMNO TO CLASS - Corregido para usar tabla intermedia
export const addAlumnoToClass = async (req: Request, res: Response) => {
  const { claseId, estudianteId } = req.body;

  try {
    // Verificar si el estudiante ya está inscrito
    const inscripcionExistente = await prisma.claseEstudiante.findUnique({
      where: {
        claseId_estudianteId: {
          claseId,
          estudianteId
        }
      }
    });

    if (inscripcionExistente) {
      return res.status(400).json({
        mensaje: "El estudiante ya está inscrito en esta clase"
      });
    }

    const inscripcion = await prisma.claseEstudiante.create({
      data: {
        claseId,
        estudianteId
      },
      include: {
        estudiante: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            grado: true,
            seccion: true
          }
        }
      }
    });

    res.status(200).json({
      mensaje: "Alumno agregado exitosamente",
      data: inscripcion.estudiante,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al agregar alumno",
      error: error,
    });
  }
};

// 7. REMOVE ALUMNO FROM CLASS - Corregido
export const removeAlumnoFromClass = async (req: Request, res: Response) => {
  const { claseId, estudianteId } = req.body;

  try {
    // Eliminar las notas del estudiante en esta clase
    await prisma.nota.deleteMany({
      where: {
        estudianteId,
        claseId
      }
    });

    // Eliminar la inscripción
    await prisma.claseEstudiante.delete({
      where: {
        claseId_estudianteId: {
          claseId,
          estudianteId
        }
      }
    });

    res.status(200).json({
      mensaje: "Alumno eliminado exitosamente de la clase",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar alumno",
      error: error,
    });
  }
};