import { Request, Response } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

//login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ message: "Usuario no encontrado" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Contraseña incorrecta" });
      return;
    }

    const payload = { id: user.id, role: user.rol };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      mensaje: "Login exitoso",
      accessToken,
      user: {
        id: user.id,
        name: user.nombre,
        role: user.rol,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

//*logout
export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    res.clearCookie("refreshToken",{path: "/"});
  }

  res.json({ message: "Sesión cerrada correctamente" });
};


//refresh token
export const refreshToken = async (req: Request, res: Response) => {
  console.log("Cookies recibidas en /refresh:", req.cookies);
console.log("JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET); 

  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401).json({ message: "Token faltante" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as any;

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    const newAccessToken = jwt.sign(
      { id: user.id, role: user.rol },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    console.log("Nuevo accessToken generado:", newAccessToken); // <---

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error al verificar refreshToken:", error); // <---
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};
