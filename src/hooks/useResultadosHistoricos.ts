import { useState, useEffect } from 'react';
import { ANIMAIS } from '@/data/bichoData';

export interface ResultadoCadastrado {
  id: string;
  data: string;
  horario: string;
  premio: number;
  milhar: string;
  grupo: number;
  animal: string;
  createdAt: string;
}

const STORAGE_KEY = 'oraculo-resultados-historicos';

export const getGrupoFromDezena = (dezena: string): { grupo: number; animal: string } => {
  const num = parseInt(dezena);
  if (num === 0) return { grupo: 25, animal: "Vaca" };
  const grupo = Math.ceil(num / 4);
  const animal = ANIMAIS.find(a => a.grupo === grupo)?.nome || "Desconhecido";
  return { grupo, animal };
};

export const useResultadosHistoricos = () => {
  const [resultados, setResultados] = useState<ResultadoCadastrado[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setResultados(JSON.parse(stored));
      } catch {
        setResultados([]);
      }
    }
  }, []);

  const salvarResultado = (resultado: Omit<ResultadoCadastrado, 'id' | 'createdAt' | 'grupo' | 'animal'>) => {
    const dezena = resultado.milhar.slice(-2);
    const { grupo, animal } = getGrupoFromDezena(dezena);
    
    const novoResultado: ResultadoCadastrado = {
      ...resultado,
      id: crypto.randomUUID(),
      grupo,
      animal,
      createdAt: new Date().toISOString(),
    };

    const novosResultados = [novoResultado, ...resultados];
    setResultados(novosResultados);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosResultados));
    return novoResultado;
  };

  const removerResultado = (id: string) => {
    const novosResultados = resultados.filter(r => r.id !== id);
    setResultados(novosResultados);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosResultados));
  };

  const limparTodos = () => {
    setResultados([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const getEstatisticas = () => {
    const frequenciaGrupos: Record<number, number> = {};
    const frequenciaPorHorario: Record<string, Record<number, number>> = {};

    resultados.forEach(r => {
      // Frequência geral
      frequenciaGrupos[r.grupo] = (frequenciaGrupos[r.grupo] || 0) + 1;
      
      // Frequência por horário
      if (!frequenciaPorHorario[r.horario]) {
        frequenciaPorHorario[r.horario] = {};
      }
      frequenciaPorHorario[r.horario][r.grupo] = (frequenciaPorHorario[r.horario][r.grupo] || 0) + 1;
    });

    const gruposOrdenados = Object.entries(frequenciaGrupos)
      .sort((a, b) => b[1] - a[1])
      .map(([grupo, freq]) => ({
        grupo: parseInt(grupo),
        frequencia: freq,
        animal: ANIMAIS.find(a => a.grupo === parseInt(grupo))?.nome || "?"
      }));

    return { frequenciaGrupos, frequenciaPorHorario, gruposOrdenados };
  };

  return {
    resultados,
    salvarResultado,
    removerResultado,
    limparTodos,
    getEstatisticas,
  };
};
