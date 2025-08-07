import { prisma } from "../src/lib/prisma";

async function main() {
  // 1. Limpiar la base de datos (opcional, cuidado en producción)
  await prisma.nota.deleteMany();
  await prisma.estudiante.deleteMany();
  await prisma.clase.deleteMany();
  await prisma.materia.deleteMany();
  await prisma.user.deleteMany();
  await prisma.ponderacion.deleteMany();

  // 2. Crear ponderaciones para ciclos
  await prisma.ponderacion.createMany({
    data: [
      {
        ciclo: 'PRIMARIA',
        formula: '0.25,0.25,0.25,0.25' // 4 bimestres con igual peso
      },
      {
        ciclo: 'SECUNDARIA',
        formula: '0.20,0.30,0.20,0.30' // Bimestres 2 y 4 pesan más
      }
    ]
  });

  // 3. Crear usuarios
  const admin = await prisma.user.create({
    data: {
      nombre: 'Admin Principal',
      email: 'admin@escuela.com',
      password: '$2b$10$EjemploDeHashSeguro', // Usar bcrypt en producción
      telefono: '123456789',
      direccion: 'Av. Principal 123',
      rol: 'ADMIN'
    }
  });

  const superadmin = await prisma.user.create({
    data: {
      nombre: 'Super Admin',
      email: 'superadmin@escuela.com',
      password: '$2b$10$EjemploDeHashSeguro',
      telefono: '987654321',
      direccion: 'Av. Secundaria 456',
      rol: 'SUPERADMIN'
    }
  });

  const docente = await prisma.user.create({
    data: {
      nombre: 'Profesor Juan Pérez',
      email: 'juan@escuela.com',
      password: '$2b$10$EjemploDeHashSeguro',
      telefono: '555123456',
      direccion: 'Calle Docente 789',
      rol: 'DOCENTE'
    }
  });

  // 4. Crear materias
  const matematica = await prisma.materia.create({
    data: {
      nombre: 'Matemáticas',
      ciclo: 'PRIMARIA',
      codigo: 'MATH-001'
    }
  });

  const ciencia = await prisma.materia.create({
    data: {
      nombre: 'Ciencias Naturales',
      ciclo: 'SECUNDARIA',
      codigo: 'SCI-001'
    }
  });

  // 5. Asignar clases al docente
  await prisma.clase.create({
    data: {
      docenteId: docente.id,
      materiaId: matematica.id
    }
  });

  // 6. Crear estudiantes
  const estudiante1 = await prisma.estudiante.create({
    data: {
      nombre: 'Ana',
      apellido: 'García',
      dni: '12345678A',
      telefono: '111222333',
      direccion: 'Calle Estudiante 1',
      grado: 5,
      seccion: 'A'
    }
  });

  const estudiante2 = await prisma.estudiante.create({
    data: {
      nombre: 'Luis',
      apellido: 'Martínez',
      dni: '87654321B',
      telefono: '444555666',
      direccion: 'Calle Estudiante 2',
      grado: 5,
      seccion: 'A'
    }
  });

  const estudiante3 = await prisma.estudiante.create({
    data: {
      nombre: 'Marta',
      apellido: 'Rodríguez',
      dni: '56781234C',
      telefono: '777888999',
      direccion: 'Calle Estudiante 3',
      grado: 6,
      seccion: 'B'
    }
  });

  // 7. Registrar notas (el docente califica a los estudiantes)
  await prisma.nota.createMany({
    data: [
      {
        estudianteId: estudiante1.id,
        materiaId: matematica.id,
        bimestre: 1,
        nota: 15.5,
        docenteId: docente.id
      },
      {
        estudianteId: estudiante2.id,
        materiaId: matematica.id,
        bimestre: 1,
        nota: 18.0,
        docenteId: docente.id
      }
    ]
  });

  console.log('✅ Datos de prueba creados correctamente:');
  console.log('- 3 usuarios (admin, superadmin, docente)');
  console.log('- 2 materias');
  console.log('- 3 estudiantes');
  console.log('- 2 notas registradas');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });