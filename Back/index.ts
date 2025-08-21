// src/index.ts
import app from "./src/server";
import { config } from "./config";
import http from "http";
import { Server as SocketServer } from "socket.io";


import dotenv from 'dotenv';
dotenv.config();


const server = http.createServer(app);
export const io = new SocketServer(server, {
  cors: {
    origin: "*", // En un entorno de producción, deberías restringir esto a tu dominio de frontend
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`);
});

server.listen(config.PORT, () => {
  console.log(`🚀 Servidor escuchando en Puerto ${config.PORT}`);
});
