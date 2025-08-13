import { Router } from "express";
import { getNotaById, createNota, updateNota, deleteNota } from "../controllers/notasController";

const notasRouter = Router();

notasRouter.get("/:id", getNotaById);
notasRouter.post("/", createNota);
notasRouter.put("/:id", updateNota);
notasRouter.delete("/:id", deleteNota);

export default notasRouter;