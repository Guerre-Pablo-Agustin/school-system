import { Router } from "express";
import { getMaterias, getMateriaByCodigo, createMateria, updateMateria, deleteMateria, getMateriaById, } from "../controllers/materiasController";

const router = Router();

router.get("/", getMaterias);
router.get("/id/:id", getMateriaById);
router.get("/codigo/:codigo", getMateriaByCodigo);
router.post("/", createMateria);
router.put("/:id", updateMateria);
router.delete("/:id", deleteMateria);


export default router;