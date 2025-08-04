import { Request, Response } from "express";
import { FilterUser, User } from "../types/Usuario.type";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

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
      }
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
  const { nombre, email, password, rol, materias } = req.body;

  try {
     const user: User = await prisma.user.create({
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

  res.status(201).json({
    mensaje: "Usuario creado exitosamente",
    data: user,
  });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear usuario",
      error: error,
    });
  }

};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, email, password, rol, materias } = req.body;

  try {
    const user: User = await prisma.user.update({
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
