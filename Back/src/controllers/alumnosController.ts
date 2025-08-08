import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getAlumnos = async (req: Request, res: Response) => {
  try {
    const alumnos = await prisma.estudiante.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        dni: true,
        grado: true,
        seccion: true,
        notas: {
          select: {
            bimestre: true,
            nota: true,
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

    res.status(200).json({
      mensaje: "Listado de alumnos",
      data: alumnos,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener alumnos",
      error: error,
    });
  }
};

export const getAlumno = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const alumno = await prisma.estudiante.findUnique({
      where: {
        id,
      },
       select: {
        id: true,
        nombre: true,
        apellido: true,
        dni: true,
        grado: true,
        seccion: true,
        notas: {
          select: {
            bimestre: true,
            nota: true,
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

    res.status(200).json({
      mensaje: "Alumno encontrado",
      data: alumno,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener alumno",
      error: error,
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
      notas,
      telefono,
      direccion,
      seccion,
    } = req.body;

    // Validaciones mejoradas
    const requiredFields = ["nombre", "apellido", "dni", "grado", "notas"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Campos requeridos faltantes",
        missingFields,
        details: "Todos los campos marcados son obligatorios",
      });
    }

    // Creación del alumno
    const newAlumno = await prisma.estudiante.create({
      data: {
        nombre,
        apellido,
        dni,
        grado,
        seccion,
        notas,
        telefono,
        direccion,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Alumno creado exitosamente",
      data: newAlumno,
    });
  } catch (error) {
    console.error("Error en createAlumno:", error);

    return res.status(500).json({
      error: "Error interno del servidor",
      ...(process.env.NODE_ENV === "development" && {
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }),
    });
  }
};

export const updateAlumno = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, apellido, dni, grado, notas } = req.body;

  try {
    const alumno = await prisma.estudiante.update({
      where: {
        id,
      },
      data: {
        nombre,
        apellido,
        dni,
        grado,
        notas,
      },
      include: {
        notas: true,
      },
    });

    res.status(200).json({
      mensaje: "Alumno actualizado exitosamente",
      data: alumno,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar alumno",
      error: error,
    });
  }
};

export const deleteAlumno = async (req: Request, res: Response) => {
  const { id } = req.params;

  const alumno = await prisma.estudiante.delete({
    where: {
      id,
    },
  });

  res.status(200).json(alumno);
};
