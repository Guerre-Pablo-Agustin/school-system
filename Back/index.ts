// src/index.ts
import app from "./src/server";
import { config } from "./config";
import http from "http";
import { Server as SocketServer } from "socket.io";


import dotenv from 'dotenv';
dotenv.config();

// Debug: verificar que las variables se cargaron
console.log('🔍 Environment Check:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Loaded' : '❌ Missing');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);


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
