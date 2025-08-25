import { Router } from "express";
import { getAll, getById, createClass, updateClass, deleteClass,getByDocente, addAlumnoToClass } from "../controllers/clasesController";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getById);
router.post("/", verifyToken, createClass);
router.put("/:id", verifyToken, updateClass);
router.delete("/:id", verifyToken, deleteClass);
router.get("/docente/:id", verifyToken, getByDocente);
router.post("/estudiantes-clase", addAlumnoToClass)

export default router;