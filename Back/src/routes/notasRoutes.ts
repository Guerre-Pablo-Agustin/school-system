import { Router } from "express";
import { getNotaById, createOrUpdateNota, updateNota, deleteNota } from "../controllers/notasController";

const notasRouter = Router();

notasRouter.get("/:id", getNotaById);
notasRouter.post("/", createOrUpdateNota);
notasRouter.put("/:id", updateNota);
notasRouter.delete("/:id", deleteNota);



export default notasRouter;