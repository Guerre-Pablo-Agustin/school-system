import { Request, Response } from "express";
import { User } from "../types/Usuario.type";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        materias: true,
      },
    });

    res.status(200).json({
      mensaje: "Listado de usuarios",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener usuarios",
      error: error,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        materias: true,
      },
    });

    res.status(200).json({
      mensaje: "Usuario encontrado",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener usuario",
      error: error,
    });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { nombre, email, password, rol, materias } = req.body;

    // Validaciones mejoradas
    const requiredFields = ['nombre', 'email', 'password', 'rol'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: "Campos requeridos faltantes",
        missingFields,
        details: "Todos los campos marcados son obligatorios"
      });
    }

    // Verificar email único
    const existingUser = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (existingUser) {
      return res.status(409).json({
        error: "El email ya está registrado",
        suggestion: "Utilice otro email o recupere su cuenta"
      });
    }

    // Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Creación del usuario
    const newUser = await prisma.user.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol,
        ...(materias && materias.length > 0 && {
          materias: {
            connect: materias.map((codigo: string) => ({ codigo }))
          }
        })
      },
      include: {
        materias: {
          select: {
            codigo: true,
            nombre: true
          }
        }
      }
    });

    // Eliminar password de la respuesta
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      data: userWithoutPassword
    });

  } catch (error) {
    console.error('Error en createUser:', error);
    
    return res.status(500).json({
      error: "Error interno del servidor",
      ...(process.env.NODE_ENV === 'development' && {
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      })
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, email, password, rol, materias } = req.body;

  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        nombre,
        email,
        password: await bcrypt.hash(password, 10),
        rol,
        materias,
      },
      include: {
        materias: true,
      },
    });

    res.status(200).json({
      mensaje: "Usuario actualizado exitosamente",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar usuario",
      error: error,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.delete({
    where: {
      id,
    },
  });

  res.status(200).json(user);
};
