import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const LIMITE_DIARIO = 50;

export const useUsoDiario = () => {
  const { user } = useAuth();
  const [geracoes, setGeracoes] = useState(0);
  const [loading, setLoading] = useState(true);

  const buscarUsoHoje = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const hoje = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('uso_diario')
        .select('geracoes')
        .eq('user_id', user.id)
        .eq('data', hoje)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar uso:', error);
        return;
      }

      setGeracoes(data?.geracoes || 0);
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    buscarUsoHoje();
  }, [buscarUsoHoje]);

  const incrementarUso = async (): Promise<boolean> => {
    if (!user) return false;
    
    if (geracoes >= LIMITE_DIARIO) {
      return false;
    }

    try {
      const hoje = new Date().toISOString().split('T')[0];
      
      // Upsert - insere ou atualiza
      const { error } = await supabase
        .from('uso_diario')
        .upsert({
          user_id: user.id,
          data: hoje,
          geracoes: geracoes + 1
        }, {
          onConflict: 'user_id,data'
        });

      if (error) {
        console.error('Erro ao incrementar uso:', error);
        return false;
      }

      setGeracoes(prev => prev + 1);
      return true;
    } catch (err) {
      console.error('Erro:', err);
      return false;
    }
  };

  const podeGerar = geracoes < LIMITE_DIARIO;
  const geracoesRestantes = LIMITE_DIARIO - geracoes;

  return {
    geracoes,
    geracoesRestantes,
    podeGerar,
    loading,
    incrementarUso,
    LIMITE_DIARIO
  };
};
