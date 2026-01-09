import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AnaliseQuantica {
  numeros: string[];
  grupos: number[];
  confianca: number;
  explicacao: string;
  padroesIdentificados: string[];
  gruposQuentes: number[];
  gruposFrios: number[];
  recomendacaoEspecial: string;
}

export interface MetricasAprendizado {
  metricas: {
    total_previsoes: number;
    total_acertos: number;
    taxa_acerto: number;
    melhor_metodo: string | null;
    melhor_grupo: number | null;
    melhor_horario: string | null;
  };
  topPadroes: Array<{
    tipo: string;
    valor: string;
    frequencia: number;
    peso: number;
  }>;
  ultimasPrevisoes: Array<{
    id: string;
    numeros: string[];
    acertou: boolean | null;
    confianca: number;
    created_at: string;
  }>;
}

export const useInteligenciaQuantica = () => {
  const [loading, setLoading] = useState(false);
  const [analise, setAnalise] = useState<AnaliseQuantica | null>(null);
  const [metricas, setMetricas] = useState<MetricasAprendizado | null>(null);

  const analisar = async (horario: string, modalidade: string, digitos: number): Promise<AnaliseQuantica | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('inteligencia-quantica', {
        body: { 
          action: 'analisar',
          data: { horario, modalidade, digitos }
        }
      });

      if (error) {
        console.error('Erro na análise:', error);
        toast.error('Erro ao analisar. Tente novamente.');
        return null;
      }

      if (data.error) {
        toast.error(data.error);
        return null;
      }

      setAnalise(data);
      return data;
    } catch (err) {
      console.error('Erro:', err);
      toast.error('Erro de conexão. Verifique sua internet.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const registrarResultado = async (milhar: string, horario: string, premio: number, data: string) => {
    try {
      const { data: response, error } = await supabase.functions.invoke('inteligencia-quantica', {
        body: { 
          action: 'registrar_resultado',
          data: { milhar, horario, premio, data }
        }
      });

      if (error) {
        toast.error('Erro ao registrar resultado');
        return null;
      }

      if (response.acertou) {
        toast.success('🎉 A IA acertou! Aprendizado reforçado!');
      } else {
        toast.info('Resultado registrado. A IA está aprendendo...');
      }

      return response;
    } catch (err) {
      console.error('Erro:', err);
      toast.error('Erro ao registrar');
      return null;
    }
  };

  const obterMetricas = async (): Promise<MetricasAprendizado | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('inteligencia-quantica', {
        body: { action: 'obter_metricas', data: {} }
      });

      if (error) {
        console.error('Erro ao obter métricas:', error);
        return null;
      }

      setMetricas(data);
      return data;
    } catch (err) {
      console.error('Erro:', err);
      return null;
    }
  };

  return {
    loading,
    analise,
    metricas,
    analisar,
    registrarResultado,
    obterMetricas,
  };
};
