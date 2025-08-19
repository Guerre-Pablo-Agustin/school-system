"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Nota } from "../../../types/nota.type";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useCreateOrUpdateNotaMutation } from "@/redux/services/notasApi";
import { useSelector } from "react-redux";
import { selectUserLogin } from "@/redux/features/userSlice";

interface TablasNotasProps {
  alumnoId: string;
  dataNotas: Nota[] | undefined;
  onSaved?: () => void; // opcional: para refetch externo
}

type Bim = 1 | 2 | 3 | 4;

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

const TablasNotas = ({ alumnoId, dataNotas = [], onSaved }: TablasNotasProps) => {
  const userLogin = useSelector(selectUserLogin);
  const [createOrUpdateNota, { isLoading: saving }] = useCreateOrUpdateNotaMutation();


  console.log("dataNotas", dataNotas)

  // 1) PIVOT inicial desde props
  const materiasPivot = useMemo(() => {
    const map = new Map<string, FilaTabla>();
    dataNotas.forEach((n) => {
      const key = n.materia.id;
      if (!map.has(key)) {
        map.set(key, {
          materia: n.materia.nombre,
          materiaId: n.materia.id,
          codigo: n.materia.codigo,
          ciclo: n.materia.ciclo,
          bimestre1: "",
          bimestre2: "",
          bimestre3: "",
          bimestre4: "",
        });
      }
      const row = map.get(key)!;
      (row)[`bimestre${n.bimestre}`] = n.nota; // número
    });
    return Array.from(map.values()).sort((a, b) => a.materia.localeCompare(b.materia));
    
    
  }, [dataNotas]);
  
  console.log("materiasPivot", materiasPivot)
  // 2) Estado local de filas (para reflejar cambios sin recargar)
  const [rows, setRows] = useState<FilaTabla[]>([]);
  useEffect(() => setRows(materiasPivot), [materiasPivot]);

  // 3) Edición por fila
  const [editandoMateriaId, setEditandoMateriaId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Record<Bim, string>>({
    1: "", 2: "", 3: "", 4: ""
  });

  const toStr = (v: string | number) => (v === "" ? "" : String(v));

  const beginEdit = (fila: FilaTabla) => {
    setEditandoMateriaId(fila.materiaId);
    setDraft({
      1: toStr(fila.bimestre1),
      2: toStr(fila.bimestre2),
      3: toStr(fila.bimestre3),
      4: toStr(fila.bimestre4),
    });
  };

  const cancelEdit = () => {
    setEditandoMateriaId(null);
    setDraft({ 1: "", 2: "", 3: "", 4: "" });
  };

  const changeDraft = (b: Bim, v: string) => {
    setDraft((d) => ({ ...d, [b]: v }));
  };

  const hasChanges = (fila: FilaTabla) =>
    (toStr(fila.bimestre1) !== draft[1]) ||
    (toStr(fila.bimestre2) !== draft[2]) ||
    (toStr(fila.bimestre3) !== draft[3]) ||
    (toStr(fila.bimestre4) !== draft[4]);

  const saveRow = async (fila: FilaTabla) => {
    if (!userLogin?.id) {
      toast.error("Usuario no autenticado");
      return;
    }

    const ops: Array<{ b: Bim; val: number }> = [];
    ([1, 2, 3, 4] as Bim[]).forEach((b) => {
      const raw = draft[b].trim();
      if (raw === "") return; // vacío: no enviar nada
      const num = parseFloat(raw);
      if (isNaN(num) || num < 1 || num > 10) {
        return toast.error(`Nota inválida en ${b}° bimestre (1 a 10)`);
      }
      // Si no cambió, no lo mandamos
      const original = toStr((fila)[`bimestre${b}`]);
      if (original === raw) return;
      ops.push({ b, val: num });
    });

    if (ops.length === 0) {
      toast.message("No hay cambios por guardar");
      cancelEdit();
      return;
    }

    try {
      for (const { b, val } of ops) {
        await createOrUpdateNota({
          estudianteId: alumnoId,
          materiaId: fila.materiaId,
          bimestre: b,
          nota: val,
          docenteId: userLogin.id,
        }).unwrap();
      }

      // Actualizar fila local
      setRows((prev) =>
        prev.map((r) =>
          r.materiaId === fila.materiaId
            ? {
              ...r,
              bimestre1: draft[1] === "" ? r.bimestre1 : parseFloat(draft[1]),
              bimestre2: draft[2] === "" ? r.bimestre2 : parseFloat(draft[2]),
              bimestre3: draft[3] === "" ? r.bimestre3 : parseFloat(draft[3]),
              bimestre4: draft[4] === "" ? r.bimestre4 : parseFloat(draft[4]),
            }
            : r
        )
      );

      toast.success("Notas guardadas");
      cancelEdit();
      onSaved?.(); // opcional: refresca datos del server
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar notas");
    }
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-left font-semibold">Materia</th>
            <th className="border px-4 py-2 text-center font-semibold">1° Bimestre</th>
            <th className="border px-4 py-2 text-center font-semibold">2° Bimestre</th>
            <th className="border px-4 py-2 text-center font-semibold">3° Bimestre</th>
            <th className="border px-4 py-2 text-center font-semibold">4° Bimestre</th>
            <th className="border px-4 py-2 text-center font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((fila) => {
            const editing = editandoMateriaId === fila.materiaId;

            return (
              <tr key={fila.materiaId}>
                <td className="border px-4 py-2 font-medium">{fila.materia}</td>

                {([1, 2, 3, 4] as Bim[]).map((b) => (
                   <td key={`${fila.materiaId}-${b}`} className="border px-4 py-2 text-center">
                    {editing ? (
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        step="0.1"
                        className="w-20 mx-auto"
                        value={draft[b]}
                        onChange={(e) => changeDraft(b, e.target.value)}
                      />
                    ) : (
                      <span>
                        {toStr(fila[`bimestre${b}`]) === "" ? "-" : fila[`bimestre${b}`]}
                      </span>
                    )}
                  </td>
                ))}

                <td className="border px-4 py-2 text-center">
                  {editing ? (
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        disabled={saving || !hasChanges(fila)}
                        onClick={() => saveRow(fila)}
                      >
                        {saving ? "Guardando..." : "Guardar"}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={cancelEdit}
                        disabled={saving}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => beginEdit(fila)}
                    >
                      Editar
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>No hay notas registradas para este alumno.</p>
          <p className="text-sm mt-2">Haz clic en Agregar Nota para comenzar.</p>
        </div>
      )}
    </div>
  );
};

export default TablasNotas;
