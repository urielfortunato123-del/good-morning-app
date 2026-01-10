import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Resultado {
  id: string;
  data: string;
  horario: string;
  premio: number;
  milhar: string;
  dezena: string;
  grupo: number;
  animal: string;
}

interface PadraoDetectado {
  tipo: string;
  valor: string;
  frequencia: number;
  peso: number;
  contexto: Record<string, any>;
  taxa_acerto?: number;
}

function analisarGruposQuentes(resultados: Resultado[], dias: number = 30): PadraoDetectado[] {
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - dias);
  
  const recentes = resultados.filter(r => new Date(r.data) >= dataLimite);
  const frequencia: Record<number, number> = {};
  
  recentes.forEach(r => {
    frequencia[r.grupo] = (frequencia[r.grupo] || 0) + 1;
  });
  
  const total = recentes.length;
  const media = total / 25; // 25 grupos
  
  const padroes: PadraoDetectado[] = [];
  
  Object.entries(frequencia).forEach(([grupo, freq]) => {
    const desvio = freq / media;
    if (desvio > 1.3) {
      padroes.push({
        tipo: 'grupo_quente',
        valor: grupo,
        frequencia: freq,
        peso: Math.min(desvio, 3),
        contexto: { dias, total_aparicoes: freq, media_esperada: media.toFixed(2), desvio: desvio.toFixed(2) }
      });
    } else if (desvio < 0.7 && freq > 0) {
      padroes.push({
        tipo: 'grupo_frio',
        valor: grupo,
        frequencia: freq,
        peso: Math.min(1 / desvio, 2),
        contexto: { dias, total_aparicoes: freq, media_esperada: media.toFixed(2), desvio: desvio.toFixed(2) }
      });
    }
  });
  
  return padroes;
}

function analisarPadroesHorario(resultados: Resultado[]): PadraoDetectado[] {
  const porHorario: Record<string, Record<number, number>> = {};
  
  resultados.forEach(r => {
    if (!porHorario[r.horario]) {
      porHorario[r.horario] = {};
    }
    porHorario[r.horario][r.grupo] = (porHorario[r.horario][r.grupo] || 0) + 1;
  });
  
  const padroes: PadraoDetectado[] = [];
  
  Object.entries(porHorario).forEach(([horario, grupos]) => {
    const total = Object.values(grupos).reduce((a, b) => a + b, 0);
    const media = total / 25;
    
    Object.entries(grupos).forEach(([grupo, freq]) => {
      const desvio = freq / media;
      if (desvio > 1.5 && freq >= 3) {
        padroes.push({
          tipo: 'correlacao_horario',
          valor: `${horario}:${grupo}`,
          frequencia: freq,
          peso: Math.min(desvio, 2.5),
          contexto: { 
            horario, 
            grupo: parseInt(grupo), 
            aparicoes: freq, 
            percentual: ((freq / total) * 100).toFixed(1) + '%'
          }
        });
      }
    });
  });
  
  return padroes;
}

function analisarSequencias(resultados: Resultado[]): PadraoDetectado[] {
  const ordenados = [...resultados].sort((a, b) => 
    new Date(a.data).getTime() - new Date(b.data).getTime() || 
    a.horario.localeCompare(b.horario)
  );
  
  const sequencias: Record<string, { count: number; datas: string[] }> = {};
  
  for (let i = 0; i < ordenados.length - 1; i++) {
    const atual = ordenados[i];
    const proximo = ordenados[i + 1];
    
    // Sequência de grupos consecutivos
    const chave = `${atual.grupo}->${proximo.grupo}`;
    if (!sequencias[chave]) {
      sequencias[chave] = { count: 0, datas: [] };
    }
    sequencias[chave].count++;
    sequencias[chave].datas.push(atual.data);
  }
  
  const padroes: PadraoDetectado[] = [];
  const totalTransicoes = ordenados.length - 1;
  const esperado = totalTransicoes / (25 * 25); // 625 combinações possíveis
  
  Object.entries(sequencias).forEach(([seq, info]) => {
    if (info.count >= 3 && info.count > esperado * 2) {
      const [de, para] = seq.split('->').map(Number);
      padroes.push({
        tipo: 'sequencia',
        valor: seq,
        frequencia: info.count,
        peso: Math.min(info.count / esperado, 3),
        contexto: { 
          grupo_anterior: de, 
          grupo_seguinte: para, 
          ocorrencias: info.count,
          ultimas_datas: info.datas.slice(-5)
        }
      });
    }
  });
  
  return padroes;
}

function analisarDezenas(resultados: Resultado[]): PadraoDetectado[] {
  const frequenciaDezena: Record<string, number> = {};
  
  resultados.forEach(r => {
    frequenciaDezena[r.dezena] = (frequenciaDezena[r.dezena] || 0) + 1;
  });
  
  const total = resultados.length;
  const media = total / 100; // 00-99
  
  const padroes: PadraoDetectado[] = [];
  
  Object.entries(frequenciaDezena)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([dezena, freq]) => {
      const desvio = freq / media;
      if (desvio > 1.2) {
        padroes.push({
          tipo: 'dezena_frequente',
          valor: dezena,
          frequencia: freq,
          peso: Math.min(desvio, 2),
          contexto: { 
            aparicoes: freq, 
            percentual: ((freq / total) * 100).toFixed(2) + '%',
            grupo_correspondente: Math.ceil(parseInt(dezena) / 4) || 25
          }
        });
      }
    });
  
  return padroes;
}

function analisarDiaSemana(resultados: Resultado[]): PadraoDetectado[] {
  const diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const porDia: Record<number, Record<number, number>> = {};
  
  resultados.forEach(r => {
    const dia = new Date(r.data).getDay();
    if (!porDia[dia]) porDia[dia] = {};
    porDia[dia][r.grupo] = (porDia[dia][r.grupo] || 0) + 1;
  });
  
  const padroes: PadraoDetectado[] = [];
  
  Object.entries(porDia).forEach(([dia, grupos]) => {
    const total = Object.values(grupos).reduce((a, b) => a + b, 0);
    const media = total / 25;
    
    Object.entries(grupos)
      .filter(([_, freq]) => freq / media > 1.4 && freq >= 3)
      .forEach(([grupo, freq]) => {
        padroes.push({
          tipo: 'padrao_dia_semana',
          valor: `${diasSemana[parseInt(dia)]}:${grupo}`,
          frequencia: freq,
          peso: Math.min(freq / media, 2),
          contexto: {
            dia_semana: diasSemana[parseInt(dia)],
            dia_numero: parseInt(dia),
            grupo: parseInt(grupo),
            aparicoes: freq,
            percentual: ((freq / total) * 100).toFixed(1) + '%'
          }
        });
      });
  });
  
  return padroes;
}

function analisarMilhares(resultados: Resultado[]): PadraoDetectado[] {
  // Padrões em milhares: terminações, repetições
  const terminacoes: Record<string, number> = {};
  const duplicados: Record<string, number> = {}; // milhares com dígitos repetidos
  
  resultados.forEach(r => {
    const milhar = r.milhar.padStart(4, '0');
    
    // Terminação (últimos 2 dígitos)
    terminacoes[milhar.slice(-2)] = (terminacoes[milhar.slice(-2)] || 0) + 1;
    
    // Verifica padrões especiais
    if (/(\d)\1{2,}/.test(milhar)) { // 3+ dígitos iguais
      duplicados[milhar] = (duplicados[milhar] || 0) + 1;
    }
  });
  
  const padroes: PadraoDetectado[] = [];
  
  // Top terminações
  Object.entries(terminacoes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([term, freq]) => {
      if (freq >= 3) {
        padroes.push({
          tipo: 'terminacao_frequente',
          valor: term,
          frequencia: freq,
          peso: 1 + (freq / resultados.length) * 10,
          contexto: { terminacao: term, aparicoes: freq }
        });
      }
    });
  
  return padroes;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Iniciando análise de padrões...');

    // Buscar todos os resultados históricos
    const { data: resultados, error: fetchError } = await supabase
      .from('resultados_historicos')
      .select('*')
      .order('data', { ascending: false });

    if (fetchError) {
      throw new Error(`Erro ao buscar resultados: ${fetchError.message}`);
    }

    if (!resultados || resultados.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'Nenhum resultado histórico encontrado. Importe dados primeiro.',
        padroes: [],
        total_analisado: 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Analisando ${resultados.length} resultados...`);

    // Executar todas as análises
    const todosOsPadroes: PadraoDetectado[] = [
      ...analisarGruposQuentes(resultados, 30),
      ...analisarGruposQuentes(resultados, 7), // Também últimos 7 dias
      ...analisarPadroesHorario(resultados),
      ...analisarSequencias(resultados),
      ...analisarDezenas(resultados),
      ...analisarDiaSemana(resultados),
      ...analisarMilhares(resultados),
    ];

    console.log(`${todosOsPadroes.length} padrões detectados`);

    // Salvar padrões no banco
    if (todosOsPadroes.length > 0) {
      // Limpar padrões antigos
      await supabase.from('padroes_aprendidos').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Inserir novos padrões
      const padroesParaSalvar = todosOsPadroes.map(p => ({
        tipo: p.tipo,
        valor: p.valor,
        frequencia: p.frequencia,
        peso: p.peso,
        contexto: p.contexto,
        taxa_acerto: p.taxa_acerto || 0,
        ultima_ocorrencia: resultados[0]?.data || new Date().toISOString().split('T')[0]
      }));

      const { error: insertError } = await supabase
        .from('padroes_aprendidos')
        .insert(padroesParaSalvar);

      if (insertError) {
        console.error('Erro ao salvar padrões:', insertError);
      } else {
        console.log('Padrões salvos com sucesso');
      }
    }

    // Calcular estatísticas gerais
    const gruposQuentes = todosOsPadroes.filter(p => p.tipo === 'grupo_quente');
    const gruposFrios = todosOsPadroes.filter(p => p.tipo === 'grupo_frio');
    const correlacoesHorario = todosOsPadroes.filter(p => p.tipo === 'correlacao_horario');
    const sequencias = todosOsPadroes.filter(p => p.tipo === 'sequencia');

    // Atualizar métricas
    const melhorGrupo = gruposQuentes.length > 0 
      ? parseInt(gruposQuentes.sort((a, b) => b.peso - a.peso)[0].valor)
      : null;

    const melhorHorario = correlacoesHorario.length > 0
      ? correlacoesHorario.sort((a, b) => b.peso - a.peso)[0].contexto.horario
      : null;

    await supabase
      .from('metricas_aprendizado')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001',
        total_previsoes: resultados.length,
        melhor_grupo: melhorGrupo,
        melhor_horario: melhorHorario,
        melhor_metodo: 'analise_padroes',
        ultima_atualizacao: new Date().toISOString()
      });

    const resumo = {
      total_analisado: resultados.length,
      total_padroes: todosOsPadroes.length,
      grupos_quentes: gruposQuentes.map(p => ({ grupo: parseInt(p.valor), peso: p.peso, ...p.contexto })),
      grupos_frios: gruposFrios.map(p => ({ grupo: parseInt(p.valor), peso: p.peso, ...p.contexto })),
      correlacoes_horario: correlacoesHorario.slice(0, 10).map(p => p.contexto),
      sequencias_frequentes: sequencias.slice(0, 10).map(p => p.contexto),
      dezenas_frequentes: todosOsPadroes.filter(p => p.tipo === 'dezena_frequente').map(p => p.contexto),
      padroes_dia_semana: todosOsPadroes.filter(p => p.tipo === 'padrao_dia_semana').slice(0, 10).map(p => p.contexto),
      ultima_atualizacao: new Date().toISOString()
    };

    return new Response(JSON.stringify(resumo), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: unknown) {
    console.error('Erro na análise:', err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
