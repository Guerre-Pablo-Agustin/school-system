import { Router } from "express";
import { getAlumnos, getAlumno, createAlumno, updateAlumno, deleteAlumno } from "../controllers/alumnosController";

const router = Router();

router.get("/", getAlumnos);
router.get("/:id", getAlumno);
router.post("/", createAlumno);
router.put("/:id", updateAlumno);
router.delete("/:id", deleteAlumno);    

export default router;