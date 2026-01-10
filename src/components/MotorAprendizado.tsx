import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, TrendingUp, TrendingDown, Clock, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ANIMAIS } from '@/data/bichoData';

interface AnaliseResult {
  total_analisado: number;
  total_padroes: number;
  grupos_quentes: Array<{ grupo: number; peso: number; total_aparicoes: number; desvio: string }>;
  grupos_frios: Array<{ grupo: number; peso: number; total_aparicoes: number; desvio: string }>;
  correlacoes_horario: Array<{ horario: string; grupo: number; aparicoes: number; percentual: string }>;
  sequencias_frequentes: Array<{ grupo_anterior: number; grupo_seguinte: number; ocorrencias: number }>;
  dezenas_frequentes: Array<{ aparicoes: number; percentual: string; grupo_correspondente: number }>;
  padroes_dia_semana: Array<{ dia_semana: string; grupo: number; aparicoes: number; percentual: string }>;
  ultima_atualizacao: string;
}

const getAnimalNome = (grupo: number) => {
  return ANIMAIS.find(a => a.grupo === grupo)?.nome || `Grupo ${grupo}`;
};

export const MotorAprendizado = () => {
  const [loading, setLoading] = useState(false);
  const [analise, setAnalise] = useState<AnaliseResult | null>(null);

  const executarAnalise = async () => {
    setLoading(true);
    try {
      const url = `https://qtwfsoslzqghxpnjvowf.supabase.co/functions/v1/analisar-padroes`;
      const res = await fetch(url);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao analisar');
      }

      const result = await res.json();
      setAnalise(result);
      
      if (result.total_padroes > 0) {
        toast.success(`${result.total_padroes} padrões identificados!`);
      } else {
        toast.info('Importe mais dados para identificar padrões');
      }
    } catch (err: any) {
      console.error('Erro:', err);
      toast.error(err.message || 'Erro ao analisar padrões');
    } finally {
      setLoading(false);
    }
  };

  const carregarPadroesExistentes = async () => {
    try {
      const { data: padroes } = await supabase
        .from('padroes_aprendidos')
        .select('*')
        .order('peso', { ascending: false });

      if (padroes && padroes.length > 0) {
        // Reconstruir resumo a partir dos padrões salvos
        const gruposQuentes = padroes
          .filter(p => p.tipo === 'grupo_quente')
          .map(p => ({ grupo: parseInt(p.valor), peso: p.peso, ...(p.contexto as any) }));
        
        const gruposFrios = padroes
          .filter(p => p.tipo === 'grupo_frio')
          .map(p => ({ grupo: parseInt(p.valor), peso: p.peso, ...(p.contexto as any) }));

        const correlacoesHorario = padroes
          .filter(p => p.tipo === 'correlacao_horario')
          .map(p => p.contexto as any);

        const sequencias = padroes
          .filter(p => p.tipo === 'sequencia')
          .map(p => p.contexto as any);

        const dezenas = padroes
          .filter(p => p.tipo === 'dezena_frequente')
          .map(p => p.contexto as any);

        const diasSemana = padroes
          .filter(p => p.tipo === 'padrao_dia_semana')
          .map(p => p.contexto as any);

        setAnalise({
          total_analisado: 0,
          total_padroes: padroes.length,
          grupos_quentes: gruposQuentes,
          grupos_frios: gruposFrios,
          correlacoes_horario: correlacoesHorario,
          sequencias_frequentes: sequencias,
          dezenas_frequentes: dezenas,
          padroes_dia_semana: diasSemana,
          ultima_atualizacao: padroes[0]?.updated_at || ''
        });
      }
    } catch (err) {
      console.error('Erro ao carregar padrões:', err);
    }
  };

  useEffect(() => {
    carregarPadroesExistentes();
  }, []);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-background/95 to-purple-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-purple-500" />
              Motor de Aprendizado
            </span>
            <Button onClick={executarAnalise} disabled={loading} size="sm">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Analisar Padrões
                </>
              )}
            </Button>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Analisa os dados históricos e identifica padrões estatísticos
          </p>
        </CardHeader>
      </Card>

      {analise && analise.total_padroes > 0 && (
        <>
          {/* Grupos Quentes */}
          {analise.grupos_quentes.length > 0 && (
            <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-red-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Grupos Quentes 🔥
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analise.grupos_quentes.slice(0, 8).map((g, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="bg-orange-500/10 border-orange-500/30 text-orange-300 px-3 py-1"
                    >
                      <span className="font-bold mr-1">{g.grupo}</span>
                      {getAnimalNome(g.grupo)}
                      <span className="ml-2 text-xs opacity-70">({g.total_aparicoes}x)</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Grupos Frios */}
          {analise.grupos_frios.length > 0 && (
            <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-blue-500" />
                  Grupos Frios ❄️ (podem esquentar)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analise.grupos_frios.slice(0, 8).map((g, i) => (
                    <Badge 
                      key={i} 
                      variant="outline" 
                      className="bg-blue-500/10 border-blue-500/30 text-blue-300 px-3 py-1"
                    >
                      <span className="font-bold mr-1">{g.grupo}</span>
                      {getAnimalNome(g.grupo)}
                      <span className="ml-2 text-xs opacity-70">({g.total_aparicoes}x)</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Correlações por Horário */}
          {analise.correlacoes_horario.length > 0 && (
            <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  Padrões por Horário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analise.correlacoes_horario.slice(0, 6).map((c, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded bg-green-500/10">
                      <span className="font-mono text-green-400">{c.horario}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="font-bold">{c.grupo}</span>
                      <span className="text-sm">{getAnimalNome(c.grupo)}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {c.percentual}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sequências */}
          {analise.sequencias_frequentes.length > 0 && (
            <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-amber-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Sequências Frequentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analise.sequencias_frequentes.slice(0, 6).map((s, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded bg-yellow-500/10">
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="border-yellow-500/30">
                          {s.grupo_anterior} {getAnimalNome(s.grupo_anterior)}
                        </Badge>
                        <ArrowRight className="h-3 w-3 text-yellow-500" />
                        <Badge variant="outline" className="border-yellow-500/30">
                          {s.grupo_seguinte} {getAnimalNome(s.grupo_seguinte)}
                        </Badge>
                      </div>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {s.ocorrencias}x
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Padrões por Dia da Semana */}
          {analise.padroes_dia_semana.length > 0 && (
            <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-rose-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  📅 Padrões por Dia da Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {analise.padroes_dia_semana.slice(0, 6).map((p, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded bg-pink-500/10">
                      <span className="text-pink-400 font-medium">{p.dia_semana}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="font-bold">{p.grupo}</span>
                      <span className="text-sm">{getAnimalNome(p.grupo)}</span>
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {p.percentual}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resumo */}
          <Card className="border-muted">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total de padrões identificados: <strong className="text-foreground">{analise.total_padroes}</strong></span>
                {analise.ultima_atualizacao && (
                  <span>Última análise: {new Date(analise.ultima_atualizacao).toLocaleString('pt-BR')}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {analise && analise.total_padroes === 0 && (
        <Card className="border-muted">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum padrão identificado ainda.</p>
            <p className="text-sm mt-2">Importe dados históricos na aba "Importar" primeiro.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
