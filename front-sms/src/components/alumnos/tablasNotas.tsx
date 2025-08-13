"use client";
import React, { useMemo } from "react";
import { Nota } from "../../../types/nota.type";
import { Button } from "../ui/button";

interface TablasNotasProps {
  dataNotas: Nota[] | undefined;
  onAgregarNota: () => void;
}

interface FilaTabla {
  materia: string;
  materiaId: string;
  codigo: string;
  ciclo: string;
  bimestre1: string | number;
  bimestre2: string | number;
  bimestre3: string | number;
  bimestre4: string | number;
}

const TablasNotas = ({ dataNotas = [], onAgregarNota }: TablasNotasProps) => {

       // Transformar dataNotas a formato pivotado para mostrar
  const materiasPivot = useMemo(() => {
    const map = new Map<string, FilaTabla>();

    // Agrupar notas por materia
    dataNotas.forEach((n) => {
      const materia = n.materia.nombre;
      
      if (!map.has(materia)) {
        map.set(materia, {
          materia: materia,
          materiaId: n.materia.id,
          codigo: n.materia.codigo,
          ciclo: n.materia.ciclo,
          bimestre1: "",
          bimestre2: "",
          bimestre3: "",
          bimestre4: ""
        });
      }
      
             const row = map.get(materia)!;
       row[`bimestre${n.bimestre}` as keyof FilaTabla] = String(n.nota);
    });

    return Array.from(map.values());
  }, [dataNotas]);

     return (
     <div className="overflow-x-auto border rounded-lg">
       <div className="flex justify-between items-center p-4 border-b">
         <h3 className="text-lg font-semibold">Notas del Alumno</h3>
         <Button
           type="button"
           variant="outline"
           onClick={onAgregarNota}
           className="cursor-pointer"
         >
           Agregar Nota
         </Button>
       </div>
       
       <table className="min-w-full border-collapse">
         <thead className="">
           <tr>
             <th className="border px-4 py-2 text-left font-semibold">Materia</th>
             <th className="border px-4 py-2 text-center font-semibold">1° Bimestre</th>
             <th className="border px-4 py-2 text-center font-semibold">2° Bimestre</th>
             <th className="border px-4 py-2 text-center font-semibold">3° Bimestre</th>
             <th className="border px-4 py-2 text-center font-semibold">4° Bimestre</th>
           </tr>
         </thead>
         <tbody>
           {materiasPivot.map((fila) => (
             <tr key={fila.materia} className="">
               <td className="border px-4 py-2 font-medium">{fila.materia}</td>
               {["bimestre1", "bimestre2", "bimestre3", "bimestre4"].map((b) => (
                 <td key={b} className="border px-4 py-2 text-center">
                   <span className="">
                     {fila[b as keyof FilaTabla] || "-"}
                   </span>
                 </td>
               ))}
             </tr>
           ))}
         </tbody>
       </table>

       {materiasPivot.length === 0 && (
         <div className="p-8 text-center text-gray-500">
           <p>No hay notas registradas para este alumno.</p>
           <p className="text-sm mt-2">Haz clic en Agregar Nota para comenzar.</p>
         </div>
       )}
     </div>
   );
};

export default TablasNotas;