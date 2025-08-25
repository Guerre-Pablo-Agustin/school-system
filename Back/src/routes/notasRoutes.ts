import { Router } from "express";
import { getNotaById, createOrUpdateNota, updateNota, deleteNota } from "../controllers/notasController";
import { verifyToken } from "../middleware/auth.middleware";

const notasRouter = Router();

notasRouter.get("/:id", verifyToken, getNotaById);
notasRouter.post("/", verifyToken, createOrUpdateNota);
notasRouter.put("/:id", verifyToken, updateNota);
notasRouter.delete("/:id", verifyToken, deleteNota);



export default notasRouter;