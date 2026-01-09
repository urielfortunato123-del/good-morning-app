import { useState, useEffect } from 'react';

export interface Acerto {
  id: string;
  numeros: string[];
  grupo?: number;
  animal?: string;
  modalidade: string;
  data: string;
  horario: string;
  metodosUsados: string[];
  createdAt: string;
}

const STORAGE_KEY = 'oraculo-acertos-historico';

export const getAcertosFromStorage = (): Acerto[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
};

export const useAcertosHistorico = () => {
  const [acertos, setAcertos] = useState<Acerto[]>([]);

  useEffect(() => {
    setAcertos(getAcertosFromStorage());
  }, []);

  const salvarAcerto = (acerto: Omit<Acerto, 'id' | 'createdAt'>) => {
    const novoAcerto: Acerto = {
      ...acerto,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const novosAcertos = [novoAcerto, ...acertos];
    setAcertos(novosAcertos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosAcertos));
    return novoAcerto;
  };

  const removerAcerto = (id: string) => {
    const novosAcertos = acertos.filter(a => a.id !== id);
    setAcertos(novosAcertos);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosAcertos));
  };

  const getEstatisticasAcertos = () => {
    const frequenciaGrupos: Record<number, number> = {};
    const frequenciaMetodos: Record<string, number> = {};
    const frequenciaHorarios: Record<string, number> = {};

    acertos.forEach(a => {
      if (a.grupo) {
        frequenciaGrupos[a.grupo] = (frequenciaGrupos[a.grupo] || 0) + 1;
      }
      a.metodosUsados.forEach(m => {
        frequenciaMetodos[m] = (frequenciaMetodos[m] || 0) + 1;
      });
      frequenciaHorarios[a.horario] = (frequenciaHorarios[a.horario] || 0) + 1;
    });

    return { frequenciaGrupos, frequenciaMetodos, frequenciaHorarios, total: acertos.length };
  };

  return {
    acertos,
    salvarAcerto,
    removerAcerto,
    getEstatisticasAcertos,
  };
};
