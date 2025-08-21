import { prisma } from "../lib/prisma";

export class AutoEnrollmentService {
  static async enrollStudentInGradeClasses(estudianteId: string, grado: number, anioLectivo: number) {
    // 1. Obtener materias del grado
    const materias = await prisma.materia.findMany({
      where: { grado }
    });

    // 2. Buscar clases existentes
    const clases = await prisma.clase.findMany({
      where: {
        materiaId: { in: materias.map(m => m.id) },
        anioLectivo
      }
    });

    // 3. Crear inscripciones
    const inscripciones = clases.map(clase => ({
      claseId: clase.id,
      estudianteId
    }));

    if (inscripciones.length > 0) {
      await prisma.claseEstudiante.createMany({
        data: inscripciones,
        skipDuplicates: true
      });
    }

    return {
      totalClases: clases.length,
      inscripcionesCreadas: inscripciones.length
    };
  }
}