import { Router } from "express";
import { getAlumnos, getAlumno, createAlumno, updateAlumno, deleteAlumno, getNotasAlumnoPorAnio } from "../controllers/alumnosController";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, getAlumnos);
router.get("/:id", verifyToken, getAlumno);
router.post("/", verifyToken, createAlumno);
router.put("/:id", verifyToken, updateAlumno);
router.delete("/:id", verifyToken, deleteAlumno);    
router.get("/:id/notas/:anioLectivo", verifyToken, getNotasAlumnoPorAnio);
export default router;