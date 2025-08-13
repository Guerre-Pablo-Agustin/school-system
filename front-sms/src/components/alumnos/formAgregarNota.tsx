"use client";
import React, { useState } from "react";
import { useCreateNotasMutation } from "@/redux/services/notasApi";
import { useGetMateriasQuery } from "@/redux/services/materiasApi";
import { useSelector } from "react-redux";
import { selectUserLogin } from "@/redux/features/userSlice";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, CheckCircle2, X } from "lucide-react";


interface FormAgregarNotaProps {
  alumnoId: string;
  onNotaAgregada: () => void;
  onCancelar: () => void;
}

const FormAgregarNota = ({ alumnoId, onNotaAgregada, onCancelar }: FormAgregarNotaProps) => {
  const [createNota] = useCreateNotasMutation();
  const { data: materiasData } = useGetMateriasQuery();
  const userLogin = useSelector(selectUserLogin);
  
  const [materiaId, setMateriaId] = useState("");
  const [bimestre, setBimestre] = useState<"1" | "2" | "3" | "4">("1");
  const [nota, setNota] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userLogin?.id) {
      setError("Usuario no autenticado");
      return;
    }

    if (!materiaId) {
      setError("Debes seleccionar una materia");
      return;
    }

    if (!nota || isNaN(Number(nota))) {
      setError("Debes ingresar una nota válida");
      return;
    }

    const notaNum = parseFloat(nota);
    if (notaNum < 1 || notaNum > 10) {
      setError("La nota debe estar entre 1 y 10");
      return;
    }

    setIsLoading(true);
    setMensaje("");
    setError("");

    try {
      const notaData = {
        docenteId: userLogin.id,
        estudianteId: alumnoId,
        materiaId: materiaId,
        bimestre: parseInt(bimestre) as 1 | 2 | 3 | 4,
        nota: notaNum
      };

      await createNota(notaData).unwrap();
      
      setMensaje("Nota agregada correctamente");
      setMateriaId("");
      setBimestre("1");
      setNota("");
      
      // Limpiar mensaje después de 2 segundos
      setTimeout(() => {
        setMensaje("");
        onNotaAgregada(); // Actualizar la tabla
      }, 2000);

    } catch (error: unknown) {
            console.error("Error al actualizar materia:", error);
            
            // Asegurar que siempre sea un string
            let errorMessage = "Error inesperado al actualizar la materia.";
            
            if (typeof error === 'string') {
                errorMessage = error;
            } else if (error && typeof error === 'object' && 'data' in error) {
                const errorData = error.data as { error?: string; message?: string };
                if (errorData?.error && typeof errorData.error === 'string') {
                    errorMessage = errorData.error;
                } else if (errorData?.message && typeof errorData.message === 'string') {
                    errorMessage = errorData.message;
                }
            } else if (error && typeof error === 'object' && 'message' in error) {
                const errorObj = error as { message: string };
                if (typeof errorObj.message === 'string') {
                    errorMessage = errorObj.message;
                }
            }
            
            setError(errorMessage);
            setTimeout(() => {
               setError(""); 
             },2000);
        } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" border rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Agregar Nueva Nota</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancelar}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="materia">Materia</Label>
          <Select value={materiaId} onValueChange={setMateriaId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una materia" />
            </SelectTrigger>
            <SelectContent>
              {materiasData?.data?.map((materia) => (
                <SelectItem key={materia.id} value={materia.id}>
                  {materia.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bimestre">Bimestre</Label>
          <Select value={bimestre} onValueChange={(value) => setBimestre(value as "1" | "2" | "3" | "4")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1° Bimestre</SelectItem>
              <SelectItem value="2">2° Bimestre</SelectItem>
              <SelectItem value="3">3° Bimestre</SelectItem>
              <SelectItem value="4">4° Bimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nota">Nota</Label>
          <Input
            id="nota"
            type="number"
            min="1"
            max="10"
            step="0.1"
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Ej: 8.5"
            className="w-full"
          />
          <p className="text-sm text-gray-500">La nota debe estar entre 1 y 10</p>
        </div>

        {mensaje && (
          <Alert className="">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {mensaje}
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Agregando..." : "Agregar Nota"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancelar}
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormAgregarNota;
