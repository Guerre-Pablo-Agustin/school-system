// prisma/seed.ts
import { PrismaClient, Rol, Ciclo } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando inserción de datos de prueba...');

  // 1. Crear Usuarios (Docentes y Admin)
  const users = await prisma.user.createMany({
    data: [
      {
        nombre: 'María González',
        email: 'maria.gonzalez@escuela.edu',
        password: '$2b$10$EXAMPLEHASHEDPASSWORD',
        telefono: '+1234567890',
        direccion: 'Av. Principal 123',
        rol: Rol.DOCENTE,
      },
      {
        nombre: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@escuela.edu',
        password: '$2b$10$EXAMPLEHASHEDPASSWORD',
        telefono: '+0987654321',
        direccion: 'Calle Secundaria 456',
        rol: Rol.DOCENTE,
      },
      {
        nombre: 'Ana Martínez',
        email: 'ana.martinez@escuela.edu',
        password: '$2b$10$EXAMPLEHASHEDPASSWORD',
        telefono: '+1122334455',
        direccion: 'Jr. Educacion 789',
        rol: Rol.DOCENTE,
      },
      {
        nombre: 'Admin Sistema',
        email: 'admin@escuela.edu',
        password: '$2b$10$ADMINHASHEDPASSWORD',
        telefono: '+5566778899',
        direccion: 'Av. Administración 001',
        rol: Rol.ADMIN,
      },
    ],
  });

  console.log(`✅ ${users.count} usuarios creados`);

  // 2. Crear Materias
  const materias = await prisma.materia.createMany({
    data: [
      {
        nombre: 'Matemáticas',
        ciclo: Ciclo.PRIMARIA,
        grado: 5,
        codigo: 'MAT-5P',
      },
      {
        nombre: 'Comunicación',
        ciclo: Ciclo.PRIMARIA,
        grado: 5,
        codigo: 'COM-5P',
      },
      {
        nombre: 'Ciencia y Ambiente',
        ciclo: Ciclo.PRIMARIA,
        grado: 5,
        codigo: 'CIA-5P',
      },
      {
        nombre: 'Álgebra',
        ciclo: Ciclo.SECUNDARIA,
        grado: 3,
        codigo: 'ALG-3S',
      },
      {
        nombre: 'Literatura',
        ciclo: Ciclo.SECUNDARIA,
        grado: 3,
        codigo: 'LIT-3S',
      },
    ],
  });

  console.log(`✅ ${materias.count} materias creadas`);

  // 3. Crear Estudiantes
  const estudiantes = await prisma.estudiante.createMany({
    data: [
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '12345678',
        telefono: '+111222333',
        direccion: 'Calle Estudiantes 101',
        grado: 5,
        seccion: 'A',
      },
      {
        nombre: 'María',
        apellido: 'López',
        dni: '87654321',
        telefono: '+444555666',
        direccion: 'Av. Aprendizaje 202',
        grado: 5,
        seccion: 'A',
      },
      {
        nombre: 'Carlos',
        apellido: 'García',
        dni: '11223344',
        telefono: '+777888999',
        direccion: 'Jr. Conocimiento 303',
        grado: 5,
        seccion: 'A',
      },
      {
        nombre: 'Laura',
        apellido: 'Martínez',
        dni: '44332211',
        telefono: '+000111222',
        direccion: 'Pasaje Saber 404',
        grado: 3,
        seccion: 'B',
      },
      {
        nombre: 'Pedro',
        apellido: 'Sánchez',
        dni: '55667788',
        telefono: '+333444555',
        direccion: 'Av. Estudio 505',
        grado: 3,
        seccion: 'B',
      },
    ],
  });

  console.log(`✅ ${estudiantes.count} estudiantes creados`);

  // 4. Crear Clases
  const docentes = await prisma.user.findMany({
    where: { rol: Rol.DOCENTE },
  });

  const materiasList = await prisma.materia.findMany();

  const clases = await prisma.clase.createMany({
    data: [
      {
        docenteId: docentes[0].id,
        materiaId: materiasList[0].id,
        anioLectivo: 2024,
      },
      {
        docenteId: docentes[0].id,
        materiaId: materiasList[2].id,
        anioLectivo: 2024,
      },
      {
        docenteId: docentes[1].id,
        materiaId: materiasList[1].id,
        anioLectivo: 2024,
      },
      {
        docenteId: docentes[2].id,
        materiaId: materiasList[3].id,
        anioLectivo: 2024,
      },
      {
        docenteId: docentes[2].id,
        materiaId: materiasList[4].id,
        anioLectivo: 2024,
      },
    ],
  });

  console.log(`✅ ${clases.count} clases creadas`);

  // 5. Inscribir estudiantes a clases
  const estudiantesList = await prisma.estudiante.findMany();
  const clasesList = await prisma.clase.findMany();

  // Estudiantes de 5to grado (primeros 3) en clases de primaria
  const inscripcionesPrimaria = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      inscripcionesPrimaria.push({
        claseId: clasesList[j].id,
        estudianteId: estudiantesList[i].id,
      });
    }
  }

  // Estudiantes de 3er grado (últimos 2) en clases de secundaria
  const inscripcionesSecundaria = [];
  for (let i = 3; i < 5; i++) {
    for (let j = 3; j < 5; j++) {
      inscripcionesSecundaria.push({
        claseId: clasesList[j].id,
        estudianteId: estudiantesList[i].id,
      });
    }
  }

  const todasInscripciones = [...inscripcionesPrimaria, ...inscripcionesSecundaria];
  
  const inscripciones = await prisma.claseEstudiante.createMany({
    data: todasInscripciones,
  });

  console.log(`✅ ${inscripciones.count} inscripciones creadas`);

  // 6. Crear Notas para los estudiantes - VERSIÓN CORREGIDA
  const notasData = [];
  
  // Para cada inscripción, crear notas de los 4 bimestres
  for (const inscripcion of todasInscripciones) {
    const clase = await prisma.clase.findUnique({
      where: { id: inscripcion.claseId },
      include: { materia: true, docente: true }
    });

    // ✅ Verificación para evitar undefined
    if (!clase) {
      console.warn(`⚠️ Clase con ID ${inscripcion.claseId} no encontrada, saltando...`);
      continue;
    }

    for (let bimestre = 1; bimestre <= 4; bimestre++) {
      // Nota aleatoria entre 10 y 20 (sistema peruano)
      const notaValor = Math.floor(Math.random() * 11) + 10;
      
      notasData.push({
        estudianteId: inscripcion.estudianteId,
        materiaId: clase.materiaId,
        claseId: inscripcion.claseId,
        docenteId: clase.docenteId,
        bimestre: bimestre,
        valor: notaValor,
      });
    }
  }

  const notas = await prisma.nota.createMany({
    data: notasData,
  });

  console.log(`✅ ${notas.count} notas creadas`);

  // 7. Crear Ponderaciones
  const ponderaciones = await prisma.ponderacion.createMany({
    data: [
      {
        ciclo: Ciclo.PRIMARIA,
        formula: '0.3,0.3,0.2,0.2',
        descripcion: 'Ponderación para educación primaria',
        activo: true,
      },
      {
        ciclo: Ciclo.SECUNDARIA,
        formula: '0.25,0.25,0.25,0.25',
        descripcion: 'Ponderación para educación secundaria',
        activo: true,
      },
    ],
  });

  console.log(`✅ ${ponderaciones.count} ponderaciones creadas`);

  console.log('🎉 ¡Datos de prueba insertados exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error insertando datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });