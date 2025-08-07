// src/server.ts

// Importaciones
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";

// Rutas
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import materiaRouter from "./routes/materiasRoutes";
import alumnoRouter from "./routes/alumnosRoutes";
import clasesRouter from "./routes/clasesRoutes";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3001",
    "http://localhost:3000",
  ],

  credentials: true,
  methods: "GET,PUT,POST,DELETE,PATCH,OPTIONS",
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
  ],
  optionSuccessStatus: 204,
};



app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Rutas
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/materias", materiaRouter);
app.use("/api/alumnos", alumnoRouter);
app.use("/api/clases", clasesRouter);


// 👉 Servir archivos estáticos desde la carpeta 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

export default app;
