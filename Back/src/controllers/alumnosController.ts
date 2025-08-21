import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { AutoEnrollmentService } from "../utils/autoEnrollmentService";

export const getAlumnos = async (req: Request, res: Response) => {
  try {
    const alumnos = await prisma.estudiante.findMany({
      orderBy: { nombre: "asc" },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        dni: true,
        grado: true,
        telefono: true,
        direccion: true,
        seccion: true,
        createdAt: true,
        inscripciones: {
          select: {
            clase: {
              select: {
                materia: {
                  select: {
                    nombre: true,
                    codigo: true,
                    ciclo: true,
                  },
                },
              },
            },
          },
        },
        notas: {
          select: {
            bimestre: true,
            valor: true, // Cambiado de 'nota' a 'valor'
            materia: {
              select: {
                nombre: true,
                codigo: true,
                ciclo: true,
              },
            },
          },
        },
      },
    });

    // Calcular promedios por materia para cada alumno
    const alumnosConPromedios = alumnos.map(alumno => {
      // Agrupar notas por materia
      const notasPorMateria: Record<string, { valores: number[], promedio?: number }> = {};
      
      alumno.notas.forEach(nota => {
        const materiaKey = nota.materia.nombre;
        if (!notasPorMateria[materiaKey]) {
          notasPorMateria[materiaKey] = { valores: [] };
        }
        notasPorMateria[materiaKey].valores.push(nota.valor);
      });

      // Calcular promedio por materia
      Object.keys(notasPorMateria).forEach(materia => {
        const notas = notasPorMateria[materia].valores;
        notasPorMateria[materia].promedio = notas.length > 0 
          ? notas.reduce((sum, nota) => sum + nota, 0) / notas.length 
          : 0;
      });

      // Promedio general
      const todasLasNotas = alumno.notas.map(n => n.valor);
      const promedioGeneral = todasLasNotas.length > 0 
        ? todasLasNotas.reduce((sum, nota) => sum + nota, 0) / todasLasNotas.length 
        : 0;

      return {
        ...alumno,
        notasPorMateria,
        promedioGeneral: Math.round(promedioGeneral * 100) / 100 // Redondear a 2 decimales
      };
    });

    res.status(200).json({
      mensaje: "Listado de alumnos",
      data: alumnosConPromedios,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener alumnos",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getAlumno = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const alumno = await prisma.estudiante.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        dni: true,
        telefono: true,
        direccion: true,
        grado: true,
        seccion: true,
        createdAt: true,
        inscripciones: {
          include: {
            clase: {
              include: {
                materia: true,
                docente: {
                  select: {
                    nombre: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        notas: {
          select: {
            id: true,
            bimestre: true,
            valor: true, // Cambiado de 'nota' a 'valor'
            createdAt: true,
            materia: {
              select: {
                id: true,
                nombre: true,
                codigo: true,
                ciclo: true,
              },
            },
            clase: {
              select: {
                id: true,
                anioLectivo: true
              }
            }
          },
          orderBy: [
            { materia: { nombre: "asc" } },
            { bimestre: "asc" }
          ]
        },
      },
    });

    if (!alumno) {
      return res.status(404).json({
        mensaje: "Alumno no encontrado",
      });
    }

    // Calcular promedios por materia
    const notasPorMateria: Record<string, { 
      notas: any[], 
      promedio: number,
      materia: any 
    }> = {};

    alumno.notas.forEach(nota => {
      const materiaKey = nota.materia.id;
      if (!notasPorMateria[materiaKey]) {
        notasPorMateria[materiaKey] = {
          notas: [],
          promedio: 0,
          materia: nota.materia
        };
      }
      notasPorMateria[materiaKey].notas.push(nota);
    });

    // Calcular promedio para cada materia
    Object.keys(notasPorMateria).forEach(key => {
      const materia = notasPorMateria[key];
      const valores = materia.notas.map((n: any) => n.valor);
      materia.promedio = valores.length > 0 
        ? valores.reduce((sum: number, valor: number) => sum + valor, 0) / valores.length 
        : 0;
    });

    // Promedio general
    const todasLasNotas = alumno.notas.map(n => n.valor);
    const promedioGeneral = todasLasNotas.length > 0 
      ? todasLasNotas.reduce((sum, nota) => sum + nota, 0) / todasLasNotas.length 
      : 0;

    res.status(200).json({
      mensaje: "Alumno encontrado",
      data: {
        ...alumno,
        notasPorMateria: Object.values(notasPorMateria),
        promedioGeneral: Math.round(promedioGeneral * 100) / 100
      },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener alumno",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const createAlumno = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      apellido,
      dni,
      grado,
      telefono,
      direccion,
      seccion,
      anioLectivo
    } = req.body;

    // Validaciones mejoradas
    const requiredFields = ["nombre", "apellido", "dni", "grado", "telefono", "direccion", "seccion", "anioLectivo"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Campos requeridos faltantes",
        missingFields,
        details: "Todos los campos marcados son obligatorios",
      });
    }

    // Validación de DNI
    if (dni) {
      const existingAlumno = await prisma.estudiante.findUnique({
        where: { dni },
      });
      if (existingAlumno) {
        return res.status(400).json({
          mensaje: "El DNI ya existe en la base de datos",
        });
      }
    }

    

    // Creación del alumno
    const newAlumno = await prisma.estudiante.create({
      data: {
        nombre,
        apellido,
        dni,
        grado: parseInt(grado),
        seccion: seccion.toUpperCase(),
        telefono,
        direccion,
      },
    });

    const enrollmentResult = await AutoEnrollmentService.enrollStudentInGradeClasses(
      newAlumno.id, 
      parseInt(grado), 
      anioLectivo
    );

    return res.status(201).json({
      success: true,
      message: "Alumno creado exitosamente",
      data: newAlumno,
      enrollment: enrollmentResult
    });
  } catch (error) {
    console.error("Error en createAlumno:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
      ...(process.env.NODE_ENV === "development" && {
        details: error instanceof Error ? error.message : String(error),
      }),
    });
  }
};

export const updateAlumno = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, apellido, dni, grado, telefono, direccion, seccion } = req.body;

  try {
    // Verificar si el alumno existe
    const alumnoExistente = await prisma.estudiante.findUnique({ where: { id } });
    if (!alumnoExistente) {
      return res.status(404).json({
        mensaje: "Alumno no encontrado",
      });
    }

    // Verificar si el DNI ya existe (excluyendo el alumno actual)
    if (dni && dni !== alumnoExistente.dni) {
      const dniExistente = await prisma.estudiante.findUnique({
        where: { dni },
      });
      if (dniExistente) {
        return res.status(400).json({
          mensaje: "El DNI ya está en uso por otro alumno",
        });
      }
    }

    if (grado && parseInt(grado) !== alumnoExistente.grado) {
      // 1. Eliminar inscripciones antiguas
      await prisma.claseEstudiante.deleteMany({
        where: { estudianteId: id }
      });

      // 2. Crear nuevas inscripciones
      await AutoEnrollmentService.enrollStudentInGradeClasses(
        id,
        parseInt(grado),
        new Date().getFullYear()
      );
    }
    
    const alumno = await prisma.estudiante.update({
      where: { id },
      data: {
        nombre,
        apellido,
        dni,
        telefono,
        direccion,
        grado: grado ? parseInt(grado) : undefined,
        seccion: seccion ? seccion.toUpperCase() : undefined,
      },
    });

    res.status(200).json({
      mensaje: "Alumno actualizado exitosamente",
      data: alumno,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar alumno",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const deleteAlumno = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Verificar si el alumno existe
    const alumnoExistente = await prisma.estudiante.findUnique({
      where: { id },
      include: {
        inscripciones: true,
        notas: true
      }
    });

    if (!alumnoExistente) {
      return res.status(404).json({
        mensaje: "Alumno no encontrado",
      });
    }

    // Eliminar notas del alumno
    await prisma.nota.deleteMany({
      where: { estudianteId: id }
    });

    // Eliminar inscripciones del alumno
    await prisma.claseEstudiante.deleteMany({
      where: { estudianteId: id }
    });

    // Finalmente eliminar el alumno
    const alumno = await prisma.estudiante.delete({
      where: { id },
    });

    res.status(200).json({
      mensaje: "Alumno eliminado exitosamente",
      data: alumno,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar alumno",
      error: error instanceof Error ? error.message : error,
    });
  }
};