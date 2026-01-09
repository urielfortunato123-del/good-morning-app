import { useEffect, useState } from 'react';
import { useInteligenciaQuantica, MetricasAprendizado } from '@/hooks/useInteligenciaQuantica';
import { Brain, TrendingUp, Target, Zap, Trophy, BarChart3, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ANIMAIS } from '@/data/bichoData';

export const PainelQuantico = () => {
  const { obterMetricas } = useInteligenciaQuantica();
  const [metricas, setMetricas] = useState<MetricasAprendizado | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      const data = await obterMetricas();
      setMetricas(data);
      setLoading(false);
    };
    carregar();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="ml-3 text-cyan-400 font-cinzel">Carregando dados quânticos...</span>
      </div>
    );
  }

  const taxaAcerto = metricas?.metricas?.taxa_acerto || 0;
  const totalPrevisoes = metricas?.metricas?.total_previsoes || 0;
  const totalAcertos = metricas?.metricas?.total_acertos || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
          <h2 className="font-cinzel text-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Painel de Inteligência Quântica
          </h2>
          <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
        </div>
        <p className="font-cormorant text-muted-foreground">
          Sistema de aprendizado contínuo baseado em IA
        </p>
      </div>

      {/* Métricas principais */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-cyan-400" />
              <span className="font-cinzel text-sm text-cyan-400">Taxa de Acerto</span>
            </div>
            <div className="text-4xl font-bold text-cyan-300">
              {taxaAcerto.toFixed(1)}%
            </div>
            <div className="h-2 rounded-full bg-cyan-950 mt-3 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                style={{ width: `${taxaAcerto}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-green-400" />
            <span className="font-cinzel text-sm text-green-400">Total de Acertos</span>
          </div>
          <div className="text-4xl font-bold text-green-300">{totalAcertos}</div>
          <p className="text-xs text-muted-foreground mt-2">de {totalPrevisoes} previsões</p>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-purple-400" />
            <span className="font-cinzel text-sm text-purple-400">Nível de Aprendizado</span>
          </div>
          <div className="text-4xl font-bold text-purple-300">
            {totalPrevisoes < 10 ? 'Iniciante' : totalPrevisoes < 50 ? 'Aprendiz' : totalPrevisoes < 100 ? 'Avançado' : 'Mestre'}
          </div>
          <p className="text-xs text-muted-foreground mt-2">{totalPrevisoes} amostras analisadas</p>
        </div>
      </div>

      {/* Padrões Aprendidos */}
      {metricas?.topPadroes && metricas.topPadroes.length > 0 && (
        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <span className="font-cinzel text-sm text-amber-400 uppercase tracking-wider">Padrões Mais Fortes</span>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {metricas.topPadroes.slice(0, 6).map((padrao, i) => {
              const isGrupo = padrao.tipo === 'grupo';
              const grupoNum = isGrupo ? parseInt(padrao.valor) : null;
              const animal = grupoNum ? ANIMAIS.find(a => a.grupo === grupoNum)?.nome : null;
              
              return (
                <div 
                  key={i}
                  className={cn(
                    "p-3 rounded-lg flex items-center justify-between",
                    "bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">#{i + 1}</span>
                    <span className="text-sm">
                      {isGrupo ? `Grupo ${padrao.valor} - ${animal}` : padrao.valor}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{padrao.frequencia}x</span>
                    <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-xs text-amber-400">
                      Peso: {padrao.peso.toFixed(1)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Últimas Previsões */}
      {metricas?.ultimasPrevisoes && metricas.ultimasPrevisoes.length > 0 && (
        <div className="p-5 rounded-xl bg-card/50 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span className="font-cinzel text-sm text-blue-400 uppercase tracking-wider">Últimas Previsões</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {metricas.ultimasPrevisoes.map((previsao) => (
              <div 
                key={previsao.id}
                className={cn(
                  "p-3 rounded-lg flex items-center justify-between",
                  previsao.acertou === true && "bg-green-500/10 border border-green-500/30",
                  previsao.acertou === false && "bg-red-500/10 border border-red-500/30",
                  previsao.acertou === null && "bg-muted/30 border border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "text-lg",
                    previsao.acertou === true && "text-green-400",
                    previsao.acertou === false && "text-red-400",
                    previsao.acertou === null && "text-muted-foreground"
                  )}>
                    {previsao.acertou === true ? '✅' : previsao.acertou === false ? '❌' : '⏳'}
                  </span>
                  <span className="font-mono text-sm">{previsao.numeros.join(' • ')}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {previsao.confianca}% confiança
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aviso */}
      {totalPrevisoes < 10 && (
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
          <p className="text-sm text-blue-400 text-center font-cormorant">
            💡 A IA precisa de mais dados para aprender. Registre resultados na aba "Cadastrar" para melhorar as previsões!
          </p>
        </div>
      )}
    </div>
  );
};

export default PainelQuantico;
