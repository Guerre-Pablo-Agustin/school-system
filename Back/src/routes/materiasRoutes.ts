import { Router } from "express";
import { getMaterias, getMateria, createMateria, updateMateria, deleteMateria } from "../controllers/materiasController";

const router = Router();

router.get("/", getMaterias);
router.get("/:codigo", getMateria);
router.post("/", createMateria);
router.put("/:id", updateMateria);
router.delete("/:id", deleteMateria);

export default router;