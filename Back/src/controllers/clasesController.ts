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
          select: {
            id: true,
            nombre: true,
            apellido: true,
            grado: true,
            seccion: true,
          },
        },
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

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const clase = await prisma.clase.findUnique({
      where: { id },
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
            email: true,
          },
        },
        estudiantes: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            grado: true,
            seccion: true,
            notas: {
              where: {
                materiaId: id
              },
              select: {
                bimestre: true,
                nota: true,
                createdAt: true 
              },
              orderBy: {
                bimestre: 'asc' 
              }
            },
          },
        },
      },
    });

    if (!clase) {
      return res.status(404).json({
        mensaje: "Clase no encontrada",
      });
    }

    // Opcional: Calcular promedios por estudiante
    const claseConPromedios = {
      ...clase,
      estudiantes: clase.estudiantes.map(estudiante => ({
        ...estudiante,
        promedio: estudiante.notas.length > 0 
          ? estudiante.notas.reduce((sum, nota) => sum + nota.nota, 0) / estudiante.notas.length
          : null
      }))
    };

    res.status(200).json({
      mensaje: "Clase encontrada",
      data: claseConPromedios,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener la clase",
      error: error instanceof Error ? error.message : error,
    });
  }
};


//get classes by docente
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

export const createClass = async (req: Request, res: Response) => {
  const { docenteId, materiaId } = req.body;
  try {
    const newClass = await prisma.clase.create({
      data: {
        docenteId,
        materiaId,
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

export const updateClass = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { docenteId, materiaId } = req.body;
  try {
    const newClass = await prisma.clase.update({
      where: {
        id,
      },
      data: {
        docenteId,
        materiaId,
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
    });

    res.status(200).json({
      mensaje: "Clase actualizada exitosamente",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar clase",
      error: error,
    });
  }
};

export const deleteClass = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.delete({
    where: {
      id,
    },
  });

  res.status(200).json(user);
};


//agregar alumno a clase
export const addAlumnoToClass = async (req: Request, res: Response) => {
  const { id, alumnoid } = req.body;

  console.log("parametros de addAlumnoToClass", id, alumnoid);
  try {
    const newClass = await prisma.clase.update({
       where: { id: id },
    data: {
      estudiantes: {
        connect: { id: alumnoid }
      }
    }
    });

    res.status(200).json({
      mensaje: "Alumno agregado exitosamente",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al agregar alumno",
      error: error,
    });
  }
};

//eliminar alumno de clase
export const removeAlumnoToClass = async (req: Request, res: Response) => {
  const { id, estudianteId } = req.body;

  try {
    const newClass = await prisma.clase.update({
      where: { id: id },
    data: {
      estudiantes: {
        disconnect: { id: estudianteId }
      }
    }
    });

    res.status(200).json({
      mensaje: "Alumno eliminado exitosamente",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar alumno",
      error: error,
    });
  }
};