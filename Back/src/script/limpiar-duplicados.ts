import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function limpiarNotasDuplicadasPrisma() {
  console.log('🔍 Buscando y eliminando notas duplicadas...');

  // 1. Encontrar grupos de duplicados
  const gruposDuplicados = await prisma.nota.groupBy({
    by: ['estudianteId', 'materiaId', 'bimestre'],
    having: {
      id: {
        _count: {
          gt: 1
        }
      }
    }
  });

  console.log(`📊 Encontrados ${gruposDuplicados.length} grupos de duplicados`);

  let totalEliminadas = 0;

  // 2. Para cada grupo, eliminar duplicados manteniendo la más reciente
  for (const grupo of gruposDuplicados) {
    const { estudianteId, materiaId, bimestre } = grupo;

    // Encontrar todas las notas duplicadas para este grupo
    const notasDuplicadas = await prisma.nota.findMany({
      where: {
        estudianteId,
        materiaId,
        bimestre
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Mantener la primera (más reciente) y eliminar las demás
    const notasAEliminar = notasDuplicadas.slice(1);
    
    if (notasAEliminar.length > 0) {
      await prisma.nota.deleteMany({
        where: {
          id: {
            in: notasAEliminar.map(n => n.id)
          }
        }
      });

      console.log(`🗑️ Eliminadas ${notasAEliminar.length} notas duplicadas para estudiante ${estudianteId}, materia ${materiaId}, bimestre ${bimestre}`);
      totalEliminadas += notasAEliminar.length;
    }
  }

  console.log(`✅ ${totalEliminadas} notas duplicadas eliminadas exitosamente`);
}

// Ejecutar
limpiarNotasDuplicadasPrisma()
  .catch(console.error)
  .finally(() => prisma.$disconnect());