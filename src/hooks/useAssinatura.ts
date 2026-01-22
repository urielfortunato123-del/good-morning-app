import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface AssinaturaInfo {
  plano: string | null;
  dataInicio: Date | null;
  dataExpiracao: Date | null;
  diasRestantes: number;
  ativo: boolean;
}

export const useAssinatura = () => {
  const { user } = useAuth();
  const [assinatura, setAssinatura] = useState<AssinaturaInfo>({
    plano: null,
    dataInicio: null,
    dataExpiracao: null,
    diasRestantes: 0,
    ativo: false
  });
  const [loading, setLoading] = useState(true);

  const buscarAssinatura = useCallback(async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('usuarios_autorizados')
        .select('plano, data_autorizacao, data_expiracao, autorizado')
        .eq('email', user.email)
        .eq('autorizado', true)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar assinatura:', error);
        setLoading(false);
        return;
      }

      if (data && data.data_expiracao) {
        const hoje = new Date();
        const expiracao = new Date(data.data_expiracao);
        const diffTime = expiracao.getTime() - hoje.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setAssinatura({
          plano: data.plano,
          dataInicio: data.data_autorizacao ? new Date(data.data_autorizacao) : null,
          dataExpiracao: expiracao,
          diasRestantes: Math.max(0, diffDays),
          ativo: diffDays > 0 && data.autorizado
        });
      } else {
        setAssinatura({
          plano: null,
          dataInicio: null,
          dataExpiracao: null,
          diasRestantes: 0,
          ativo: false
        });
      }
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    buscarAssinatura();
  }, [buscarAssinatura]);

  return {
    ...assinatura,
    loading,
    refetch: buscarAssinatura
  };
};
