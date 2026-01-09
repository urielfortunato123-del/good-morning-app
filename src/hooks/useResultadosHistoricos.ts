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

// Função para acessar resultados sem hook (para uso no motor de análise)
export const getResultadosFromStorage = (): ResultadoCadastrado[] => {
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

export const useResultadosHistoricos = () => {
  const [resultados, setResultados] = useState<ResultadoCadastrado[]>([]);

  useEffect(() => {
    setResultados(getResultadosFromStorage());
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

  const exportarDados = (): string => {
    return JSON.stringify(resultados, null, 2);
  };

  const importarDados = (jsonString: string): boolean => {
    try {
      const dados = JSON.parse(jsonString);
      if (Array.isArray(dados)) {
        // Validar estrutura básica
        const validos = dados.filter(d => 
          d.data && d.horario && d.milhar && typeof d.premio === 'number'
        ).map(d => ({
          ...d,
          id: d.id || crypto.randomUUID(),
          createdAt: d.createdAt || new Date().toISOString(),
          grupo: d.grupo || getGrupoFromDezena(d.milhar.slice(-2)).grupo,
          animal: d.animal || getGrupoFromDezena(d.milhar.slice(-2)).animal,
        }));
        
        const novosResultados = [...validos, ...resultados];
        // Remover duplicatas por id
        const unicos = novosResultados.filter((r, i, arr) => 
          arr.findIndex(x => x.id === r.id) === i
        );
        setResultados(unicos);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(unicos));
        return true;
      }
      return false;
    } catch {
      return false;
    }
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
    exportarDados,
    importarDados,
    getEstatisticas,
  };
};
