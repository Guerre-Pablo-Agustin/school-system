import { Router } from "express";
import { getAll, getById, createClass, updateClass, deleteClass,getByDocente, addAlumnoToClass } from "../controllers/clasesController";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createClass);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);
router.get("/docente/:id", getByDocente);
router.post("/estudiantes-clase", addAlumnoToClass)

export default router;