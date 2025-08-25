import { Router } from "express";
import { getMaterias, getMateriaByCodigo, createMateria, updateMateria, deleteMateria, getMateriaById, } from "../controllers/materiasController";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, getMaterias);
router.get("/id/:id", verifyToken, getMateriaById);
router.get("/codigo/:codigo", verifyToken, getMateriaByCodigo);
router.post("/", verifyToken, createMateria);
router.put("/:id", verifyToken, updateMateria);
router.delete("/:id", verifyToken, deleteMateria);


export default router;