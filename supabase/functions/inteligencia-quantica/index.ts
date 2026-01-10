import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Função para analisar padrões de sequência
function analisarSequencias(resultados: any[]) {
  const sequencias: Record<string, number> = {};
  const gruposAposGrupo: Record<number, Record<number, number>> = {};
  
  for (let i = 1; i < resultados.length; i++) {
    const atual = resultados[i];
    const anterior = resultados[i - 1];
    
    // Padrão: qual grupo aparece depois de qual
    if (!gruposAposGrupo[anterior.grupo]) {
      gruposAposGrupo[anterior.grupo] = {};
    }
    gruposAposGrupo[anterior.grupo][atual.grupo] = 
      (gruposAposGrupo[anterior.grupo][atual.grupo] || 0) + 1;
    
    // Sequência de 3 grupos
    if (i >= 2) {
      const seq = `${resultados[i-2].grupo}-${anterior.grupo}-${atual.grupo}`;
      sequencias[seq] = (sequencias[seq] || 0) + 1;
    }
  }
  
  // Encontrar sequências mais frequentes
  const seqOrdenadas = Object.entries(sequencias)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  return { sequencias: seqOrdenadas, gruposAposGrupo };
}

// Função para calcular grupos "atrasados" (que estão a muito tempo sem sair)
function calcularGruposAtrasados(resultados: any[]) {
  const ultimaAparicao: Record<number, number> = {};
  
  resultados.forEach((r, index) => {
    if (!ultimaAparicao[r.grupo]) {
      ultimaAparicao[r.grupo] = index;
    }
  });
  
  // Grupos que não aparecem há mais tempo
  const atrasados = Object.entries(ultimaAparicao)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([grupo, indice]) => ({
      grupo: parseInt(grupo),
      diasAtrasado: indice
    }));
  
  return atrasados;
}

// Função para analisar correlação horário x grupo
function analisarCorrelacaoHorario(resultados: any[]) {
  const correlacao: Record<string, Record<number, number>> = {};
  
  resultados.forEach(r => {
    if (!correlacao[r.horario]) {
      correlacao[r.horario] = {};
    }
    correlacao[r.horario][r.grupo] = (correlacao[r.horario][r.grupo] || 0) + 1;
  });
  
  // Para cada horário, encontrar os grupos mais frequentes
  const melhoresPorHorario: Record<string, { grupo: number; frequencia: number }[]> = {};
  
  for (const [horario, grupos] of Object.entries(correlacao)) {
    melhoresPorHorario[horario] = Object.entries(grupos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([grupo, freq]) => ({ grupo: parseInt(grupo), frequencia: freq }));
  }
  
  return melhoresPorHorario;
}

// Função para calcular tendências da semana
function calcularTendenciaSemanal(resultados: any[]) {
  const porDia: Record<number, Record<number, number>> = {};
  
  resultados.forEach(r => {
    const dia = new Date(r.data).getDay();
    if (!porDia[dia]) porDia[dia] = {};
    porDia[dia][r.grupo] = (porDia[dia][r.grupo] || 0) + 1;
  });
  
  const tendencias: Record<number, number[]> = {};
  for (const [dia, grupos] of Object.entries(porDia)) {
    tendencias[parseInt(dia)] = Object.entries(grupos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([g]) => parseInt(g));
  }
  
  return tendencias;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    if (action === "analisar") {
      console.log("Iniciando análise quântica com padrões aprendidos...");
      
      // Buscar dados históricos para análise
      const { data: resultados } = await supabase
        .from("resultados_historicos")
        .select("*")
        .order("data", { ascending: false })
        .limit(300);

      // BUSCAR PADRÕES COM PESO POR TIPO - PRIORIZA OS QUE MAIS ACERTAM
      const { data: padroesGrupo } = await supabase
        .from("padroes_aprendidos")
        .select("*")
        .eq("tipo", "grupo")
        .order("taxa_acerto", { ascending: false })
        .limit(25);

      const { data: padroesHorarioGrupo } = await supabase
        .from("padroes_aprendidos")
        .select("*")
        .eq("tipo", "horario_grupo")
        .ilike("valor", `${data.horario}%`)
        .order("peso", { ascending: false })
        .limit(10);

      const { data: padroesDiaGrupo } = await supabase
        .from("padroes_aprendidos")
        .select("*")
        .eq("tipo", "dia_grupo")
        .ilike("valor", `dia${new Date().getDay()}_%`)
        .order("peso", { ascending: false })
        .limit(10);

      const { data: todosPadroes } = await supabase
        .from("padroes_aprendidos")
        .select("*")
        .order("peso", { ascending: false })
        .limit(100);

      const { data: previsoes } = await supabase
        .from("previsoes_quanticas")
        .select("*")
        .eq("acertou", true)
        .order("created_at", { ascending: false })
        .limit(50);

      const { data: metricas } = await supabase
        .from("metricas_aprendizado")
        .select("*")
        .single();

      // ANÁLISE AVANÇADA DE PADRÕES
      const analiseSequencias = analisarSequencias(resultados || []);
      const gruposAtrasados = calcularGruposAtrasados(resultados || []);
      const correlacaoHorario = analisarCorrelacaoHorario(resultados || []);
      const tendenciaSemanal = calcularTendenciaSemanal(resultados || []);
      
      // Identificar último grupo que saiu
      const ultimoGrupo = resultados?.[0]?.grupo;
      const penultimoGrupo = resultados?.[1]?.grupo;
      const gruposProvaveis = ultimoGrupo ? analiseSequencias.gruposAposGrupo[ultimoGrupo] : {};
      
      // Grupos que mais saíram após o último grupo
      const proximosProvaveis = Object.entries(gruposProvaveis || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([g, freq]) => ({ grupo: parseInt(g), frequencia: freq }));

      // GRUPOS QUENTES: alta frequência nos últimos 30 resultados
      const frequenciaRecente: Record<number, number> = {};
      (resultados || []).slice(0, 30).forEach(r => {
        frequenciaRecente[r.grupo] = (frequenciaRecente[r.grupo] || 0) + 1;
      });
      const gruposQuentes = Object.entries(frequenciaRecente)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([g, f]) => ({ grupo: parseInt(g), frequencia: f }));

      // GRUPOS FRIOS: baixa frequência recente
      const gruposFrios = Object.entries(frequenciaRecente)
        .sort((a, b) => a[1] - b[1])
        .slice(0, 5)
        .map(([g, f]) => ({ grupo: parseInt(g), frequencia: f }));

      // PADRÕES QUE MAIS ACERTAM (por tipo)
      const gruposComMaiorTaxa = (padroesGrupo || [])
        .filter(p => (p.taxa_acerto || 0) > 50 && p.frequencia > 2)
        .map(p => ({ grupo: parseInt(p.valor), taxa: p.taxa_acerto, peso: p.peso }));

      const gruposParaEsteHorario = (padroesHorarioGrupo || [])
        .map(p => ({ 
          grupo: parseInt(p.valor.split('_')[1]), 
          peso: p.peso, 
          frequencia: p.frequencia,
          taxa: p.taxa_acerto 
        }));

      const gruposParaHoje = (padroesDiaGrupo || [])
        .map(p => ({ 
          grupo: parseInt(p.valor.split('_')[1]), 
          peso: p.peso,
          frequencia: p.frequencia 
        }));

      // CALCULAR SCORE PONDERADO POR GRUPO
      const scoreGrupos: Record<number, number> = {};
      
      // Peso 1: Taxa de acerto histórica
      gruposComMaiorTaxa.forEach(g => {
        scoreGrupos[g.grupo] = (scoreGrupos[g.grupo] || 0) + (g.taxa || 0) * 2;
      });
      
      // Peso 2: Correlação com horário (muito importante!)
      gruposParaEsteHorario.forEach(g => {
        scoreGrupos[g.grupo] = (scoreGrupos[g.grupo] || 0) + g.peso * 15;
      });
      
      // Peso 3: Grupos atrasados
      gruposAtrasados.forEach((g, idx) => {
        scoreGrupos[g.grupo] = (scoreGrupos[g.grupo] || 0) + (5 - idx) * 20;
      });
      
      // Peso 4: Sequência após último grupo
      proximosProvaveis.forEach((g, idx) => {
        scoreGrupos[g.grupo] = (scoreGrupos[g.grupo] || 0) + (5 - idx) * 18;
      });
      
      // Peso 5: Tendência do dia
      gruposParaHoje.forEach(g => {
        scoreGrupos[g.grupo] = (scoreGrupos[g.grupo] || 0) + g.peso * 10;
      });

      // Peso 6: Grupos quentes (momentum)
      gruposQuentes.slice(0, 3).forEach((g, idx) => {
        scoreGrupos[g.grupo] = (scoreGrupos[g.grupo] || 0) + (3 - idx) * 12;
      });

      // Top 8 grupos por score
      const gruposRankeados = Object.entries(scoreGrupos)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([g, score]) => ({ grupo: parseInt(g), score }));

      console.log("Grupos rankeados por score:", gruposRankeados);

      // Métricas de métodos que mais acertam
      const metodosQueAcertam = (todosPadroes || [])
        .filter(p => p.taxa_acerto && p.taxa_acerto > 0)
        .sort((a, b) => (b.taxa_acerto || 0) - (a.taxa_acerto || 0))
        .slice(0, 10);

      // Preparar contexto enriquecido para a IA
      const contexto = {
        resultadosRecentes: (resultados || []).slice(0, 50),
        padroesAprendidos: todosPadroes || [],
        historicoPrevisoes: previsoes || [],
        metricas: metricas || { taxa_acerto: 0, total_acertos: 0 },
        horarioSolicitado: data.horario,
        modalidade: data.modalidade,
        digitos: data.digitos,
        // Novas análises com scores ponderados
        analiseAvancada: {
          sequenciasFrequentes: analiseSequencias.sequencias,
          gruposAtrasados,
          gruposProvaveis: proximosProvaveis,
          correlacaoHorario: correlacaoHorario[data.horario] || [],
          tendenciaHoje: tendenciaSemanal[new Date().getDay()] || [],
          ultimoGrupoSaiu: ultimoGrupo,
          penultimoGrupoSaiu: penultimoGrupo,
          metodosQueAcertam: metodosQueAcertam.map(m => ({ tipo: m.tipo, valor: m.valor, taxa: m.taxa_acerto })),
          gruposRankeados, // TOP grupos por score ponderado
          gruposQuentes,
          gruposFrios,
          gruposParaEsteHorario,
          gruposParaHoje,
          gruposComMaiorTaxa
        }
      };

      console.log("Análise avançada preparada:", JSON.stringify(contexto.analiseAvancada, null, 2));

      // Chamar IA para análise
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `Você é uma Inteligência Quântica Matemática AVANÇADA especializada em análise de padrões numéricos do Jogo do Bicho brasileiro.

REGRAS DO JOGO:
- São 25 grupos de animais, cada um com 4 dezenas
- Grupo 1 (Avestruz): 01-04, Grupo 2 (Águia): 05-08... até Grupo 25 (Vaca): 97-00
- A dezena 00 pertence ao grupo 25

SISTEMA DE APRENDIZADO ATIVO:
Você tem acesso a padrões aprendidos com taxas de acerto calculadas dinamicamente. USE esses dados!

PRIORIDADES DE ANÁLISE (EM ORDEM):
1. **GRUPOS RANKEADOS POR SCORE**: Score calculado com peso de múltiplos fatores - USE COMO BASE PRINCIPAL
2. **GRUPOS PARA ESTE HORÁRIO**: Padrões aprendidos para o horário ${data.horario} - PESO ALTO
3. **GRUPOS ATRASADOS**: Há muito tempo sem sair, probabilidade crescente
4. **SEQUÊNCIA APÓS ÚLTIMO GRUPO**: O que costuma sair depois do grupo que acabou de sair
5. **GRUPOS QUENTES**: Alta frequência recente (momentum)
6. **TENDÊNCIA DO DIA**: Padrões que se repetem neste dia da semana
7. **PADRÕES COM MAIOR TAXA DE ACERTO**: Métodos que historicamente mais funcionaram

IMPORTANTE:
- Priorize os grupos com maior SCORE (já calculados combinando todos os fatores)
- Gere números que pertençam aos grupos recomendados
- Para cada grupo, as dezenas são: (grupo-1)*4 + 1 até grupo*4 (ex: grupo 5 = 17,18,19,20)

FORMATO DA RESPOSTA (JSON OBRIGATÓRIO):
{
  "numeros": ["array de strings com ${data.digitos} dígitos cada - gere 5 números"],
  "grupos": [números inteiros dos grupos recomendados - use os TOP 5 do ranking],
  "confianca": número de 1-100 baseado na qualidade dos padrões,
  "explicacao": "análise detalhada dos padrões encontrados e por que escolheu esses números",
  "padroesIdentificados": ["lista de padrões que usou na análise"],
  "gruposQuentes": [grupos com alta frequência recente],
  "gruposFrios": [grupos atrasados que podem sair],
  "recomendacaoEspecial": "dica principal baseada nos dados mais fortes"
}`
            },
            {
              role: "user",
              content: `ANÁLISE PARA ${data.digitos} DÍGITOS - HORÁRIO ${data.horario}

📊 ESTATÍSTICAS DO APRENDIZADO:
- Total de resultados analisados: ${(resultados || []).length}
- Taxa de acerto da IA: ${contexto.metricas.taxa_acerto?.toFixed(1) || 0}%
- Total de acertos registrados: ${contexto.metricas.total_acertos || 0}

🏆 TOP GRUPOS POR SCORE PONDERADO (USE ESTES!):
${JSON.stringify(contexto.analiseAvancada.gruposRankeados, null, 2)}

⏰ PADRÕES APRENDIDOS PARA HORÁRIO ${data.horario}:
${JSON.stringify(contexto.analiseAvancada.gruposParaEsteHorario, null, 2)}

📅 PADRÕES PARA HOJE (${['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'][new Date().getDay()]}):
${JSON.stringify(contexto.analiseAvancada.gruposParaHoje, null, 2)}

🎯 TRANSIÇÃO DE GRUPOS:
- Último grupo: ${contexto.analiseAvancada.ultimoGrupoSaiu || "N/A"}
- Penúltimo grupo: ${contexto.analiseAvancada.penultimoGrupoSaiu || "N/A"}
- Grupos prováveis após ${contexto.analiseAvancada.ultimoGrupoSaiu}: ${JSON.stringify(contexto.analiseAvancada.gruposProvaveis)}

🔥 GRUPOS QUENTES (momentum):
${JSON.stringify(contexto.analiseAvancada.gruposQuentes, null, 2)}

❄️ GRUPOS FRIOS/ATRASADOS (alta probabilidade):
${JSON.stringify(contexto.analiseAvancada.gruposAtrasados, null, 2)}

📈 PADRÕES COM MAIOR TAXA DE ACERTO HISTÓRICO:
${JSON.stringify(contexto.analiseAvancada.gruposComMaiorTaxa, null, 2)}

🔄 SEQUÊNCIAS MAIS FREQUENTES (3 grupos consecutivos):
${JSON.stringify(contexto.analiseAvancada.sequenciasFrequentes.slice(0, 5), null, 2)}

ÚLTIMOS 15 RESULTADOS:
${JSON.stringify(contexto.resultadosRecentes.slice(0, 15).map(r => ({ grupo: r.grupo, horario: r.horario, dezena: r.dezena, animal: r.animal })), null, 2)}

INSTRUÇÕES FINAIS:
1. USE os grupos do ranking como base principal
2. Gere 5 números de ${data.digitos} dígitos que pertençam aos grupos recomendados
3. Priorize: Score alto > Correlação horário > Atrasados > Sequências
4. Explique sua análise de forma clara`
            }
          ],
        }),
      });

      if (!aiResponse.ok) {
        console.error("Erro na API de IA:", aiResponse.status);
        if (aiResponse.status === 429) {
          return new Response(JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns segundos." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiResponse.status === 402) {
          return new Response(JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao workspace." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error("Erro na API de IA");
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices[0]?.message?.content || "{}";
      console.log("Resposta da IA:", content);
      
      // Tentar parsear JSON da resposta
      let resultado;
      try {
        const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
        resultado = JSON.parse(jsonStr);
      } catch {
        resultado = {
          numeros: [],
          grupos: [],
          confianca: 50,
          explicacao: content,
          padroesIdentificados: [],
          gruposQuentes: [],
          gruposFrios: contexto.analiseAvancada.gruposAtrasados.map(g => g.grupo),
          recomendacaoEspecial: "Análise em texto livre"
        };
      }

      // Salvar previsão para tracking
      await supabase.from("previsoes_quanticas").insert({
        data_previsao: new Date().toISOString().split('T')[0],
        horario: data.horario,
        numeros: resultado.numeros || [],
        grupos: resultado.grupos || [],
        confianca: resultado.confianca || 50,
        metodos_usados: resultado.padroesIdentificados || ["IA Quântica Avançada"],
        explicacao_ia: resultado.explicacao,
      });

      return new Response(JSON.stringify(resultado), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === "registrar_resultado") {
      // Registrar resultado real e atualizar aprendizado
      const { milhar, horario, premio, data: dataResultado } = data;
      const dezena = milhar.slice(-2);
      const grupo = dezena === "00" ? 25 : Math.ceil(parseInt(dezena) / 4);
      
      const ANIMAIS = [
        "Avestruz", "Águia", "Burro", "Borboleta", "Cachorro", "Cabra", "Carneiro", 
        "Camelo", "Cobra", "Coelho", "Cavalo", "Elefante", "Galo", "Gato", "Jacaré",
        "Leão", "Macaco", "Porco", "Pavão", "Peru", "Touro", "Tigre", "Urso", "Veado", "Vaca"
      ];
      const animal = ANIMAIS[grupo - 1] || "Desconhecido";

      // Salvar resultado
      await supabase.from("resultados_historicos").insert({
        data: dataResultado,
        horario,
        premio,
        milhar,
        dezena,
        grupo,
        animal,
      });

      // Atualizar padrões aprendidos - GRUPO
      const { data: padraoGrupo } = await supabase
        .from("padroes_aprendidos")
        .select("*")
        .eq("tipo", "grupo")
        .eq("valor", grupo.toString())
        .single();

      if (padraoGrupo) {
        await supabase.from("padroes_aprendidos")
          .update({ 
            frequencia: padraoGrupo.frequencia + 1,
            peso: Math.min(padraoGrupo.peso + 0.1, 10),
            ultima_ocorrencia: dataResultado 
          })
          .eq("id", padraoGrupo.id);
      } else {
        await supabase.from("padroes_aprendidos").insert({
          tipo: "grupo",
          valor: grupo.toString(),
          frequencia: 1,
          peso: 1.0,
          ultima_ocorrencia: dataResultado,
          contexto: { animal, horario }
        });
      }

      // Padrão de HORÁRIO + GRUPO
      const padraoHorarioValor = `${horario}_${grupo}`;
      const { data: padraoHorario } = await supabase
        .from("padroes_aprendidos")
        .select("*")
        .eq("tipo", "horario_grupo")
        .eq("valor", padraoHorarioValor)
        .single();

      if (padraoHorario) {
        await supabase.from("padroes_aprendidos")
          .update({ 
            frequencia: padraoHorario.frequencia + 1,
            peso: Math.min(padraoHorario.peso + 0.2, 15),
            ultima_ocorrencia: dataResultado 
          })
          .eq("id", padraoHorario.id);
      } else {
        await supabase.from("padroes_aprendidos").insert({
          tipo: "horario_grupo",
          valor: padraoHorarioValor,
          frequencia: 1,
          peso: 1.5,
          ultima_ocorrencia: dataResultado,
          contexto: { animal, horario, grupo }
        });
      }

      // Padrão de DIA DA SEMANA + GRUPO
      const diaSemana = new Date(dataResultado).getDay();
      const padraoDiaValor = `dia${diaSemana}_${grupo}`;
      const { data: padraoDia } = await supabase
        .from("padroes_aprendidos")
        .select("*")
        .eq("tipo", "dia_grupo")
        .eq("valor", padraoDiaValor)
        .single();

      if (padraoDia) {
        await supabase.from("padroes_aprendidos")
          .update({ 
            frequencia: padraoDia.frequencia + 1,
            peso: Math.min(padraoDia.peso + 0.15, 12),
            ultima_ocorrencia: dataResultado 
          })
          .eq("id", padraoDia.id);
      } else {
        await supabase.from("padroes_aprendidos").insert({
          tipo: "dia_grupo",
          valor: padraoDiaValor,
          frequencia: 1,
          peso: 1.2,
          ultima_ocorrencia: dataResultado,
          contexto: { animal, horario, grupo, diaSemana }
        });
      }

      // Verificar previsões anteriores e marcar acertos + ATUALIZAR TAXA DOS PADRÕES
      const { data: previsoesHoje } = await supabase
        .from("previsoes_quanticas")
        .select("*")
        .eq("data_previsao", dataResultado)
        .eq("horario", horario)
        .is("acertou", null);

      let acertou = false;
      for (const previsao of previsoesHoje || []) {
        const acertouNumero = previsao.numeros.some((n: string) => 
          milhar.endsWith(n) || dezena === n.slice(-2)
        );
        const acertouGrupo = previsao.grupos.includes(grupo);
        
        await supabase.from("previsoes_quanticas")
          .update({ 
            acertou: acertouNumero || acertouGrupo,
            numero_acertado: acertouNumero ? milhar : (acertouGrupo ? `Grupo ${grupo}` : null)
          })
          .eq("id", previsao.id);

        if (acertouNumero || acertouGrupo) {
          acertou = true;
          
          // AUMENTAR peso dos padrões que foram usados na previsão que acertou
          for (const metodo of previsao.metodos_usados || []) {
            const { data: padraoMetodo } = await supabase
              .from("padroes_aprendidos")
              .select("*")
              .ilike("valor", `%${metodo}%`)
              .single();
            
            if (padraoMetodo) {
              const novaTaxa = ((padraoMetodo.taxa_acerto || 0) * padraoMetodo.frequencia + 100) / (padraoMetodo.frequencia + 1);
              await supabase.from("padroes_aprendidos")
                .update({ 
                  peso: Math.min(padraoMetodo.peso + 0.5, 20),
                  taxa_acerto: novaTaxa
                })
                .eq("id", padraoMetodo.id);
            }
          }
        }
      }

      // Atualizar métricas gerais
      const { data: metricas } = await supabase
        .from("metricas_aprendizado")
        .select("*")
        .single();

      if (metricas) {
        const novoTotal = metricas.total_previsoes + 1;
        const novosAcertos = metricas.total_acertos + (acertou ? 1 : 0);
        const novaTaxa = (novosAcertos / novoTotal) * 100;

        // Atualizar melhor grupo/horário baseado em frequência
        const { data: melhorGrupo } = await supabase
          .from("padroes_aprendidos")
          .select("*")
          .eq("tipo", "grupo")
          .order("taxa_acerto", { ascending: false })
          .limit(1)
          .single();

        const { data: melhorHorario } = await supabase
          .from("padroes_aprendidos")
          .select("*")
          .eq("tipo", "horario_grupo")
          .order("taxa_acerto", { ascending: false })
          .limit(1)
          .single();

        await supabase.from("metricas_aprendizado")
          .update({
            total_previsoes: novoTotal,
            total_acertos: novosAcertos,
            taxa_acerto: novaTaxa,
            melhor_grupo: melhorGrupo ? parseInt(melhorGrupo.valor) : metricas.melhor_grupo,
            melhor_horario: melhorHorario ? melhorHorario.valor.split('_')[0] : metricas.melhor_horario,
            ultima_atualizacao: new Date().toISOString()
          })
          .eq("id", metricas.id);
      } else {
        // Criar primeira métrica
        await supabase.from("metricas_aprendizado").insert({
          total_previsoes: 1,
          total_acertos: acertou ? 1 : 0,
          taxa_acerto: acertou ? 100 : 0,
          melhor_grupo: grupo,
          melhor_horario: horario
        });
      }

      return new Response(JSON.stringify({ 
        success: true, 
        grupo, 
        animal,
        acertou,
        mensagem: acertou ? "🎉 Acerto registrado! Padrões atualizados com peso maior!" : "Resultado registrado para aprendizado"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === "obter_metricas") {
      const { data: metricas } = await supabase
        .from("metricas_aprendizado")
        .select("*")
        .single();

      const { data: topPadroes } = await supabase
        .from("padroes_aprendidos")
        .select("*")
        .order("peso", { ascending: false })
        .limit(15);

      const { data: ultimasPrevisoes } = await supabase
        .from("previsoes_quanticas")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      // Grupos quentes (mais frequentes recentemente)
      const { data: resultadosRecentes } = await supabase
        .from("resultados_historicos")
        .select("grupo")
        .order("created_at", { ascending: false })
        .limit(50);

      const frequenciaGrupos: Record<number, number> = {};
      (resultadosRecentes || []).forEach(r => {
        frequenciaGrupos[r.grupo] = (frequenciaGrupos[r.grupo] || 0) + 1;
      });

      const gruposQuentes = Object.entries(frequenciaGrupos)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([g, f]) => ({ grupo: parseInt(g), frequencia: f }));

      return new Response(JSON.stringify({ 
        metricas,
        topPadroes,
        ultimasPrevisoes,
        gruposQuentes
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === "obter_alertas") {
      // Buscar grupos que estão "quentes" e devem sair em breve
      const { data: resultados } = await supabase
        .from("resultados_historicos")
        .select("*")
        .order("data", { ascending: false })
        .limit(100);

      const gruposAtrasados = calcularGruposAtrasados(resultados || []);
      const correlacao = analisarCorrelacaoHorario(resultados || []);
      
      const horaAtual = new Date().getHours();
      const proximoHorario = horaAtual < 9 ? "09:20" : 
                            horaAtual < 11 ? "11:20" : 
                            horaAtual < 14 ? "14:20" : 
                            horaAtual < 16 ? "16:20" : 
                            horaAtual < 18 ? "18:20" : "21:20";

      const gruposParaProximoHorario = correlacao[proximoHorario] || [];

      const alertas = [];
      
      // Alertas de grupos atrasados
      for (const g of gruposAtrasados.slice(0, 3)) {
        alertas.push({
          tipo: "atrasado",
          grupo: g.grupo,
          mensagem: `Grupo ${g.grupo} está há ${g.diasAtrasado} sorteios sem sair - Alta probabilidade!`,
          prioridade: "alta"
        });
      }

      // Alertas de horário
      if (gruposParaProximoHorario.length > 0) {
        alertas.push({
          tipo: "horario",
          grupos: gruposParaProximoHorario.slice(0, 3).map(g => g.grupo),
          mensagem: `Grupos quentes para ${proximoHorario}: ${gruposParaProximoHorario.slice(0, 3).map(g => g.grupo).join(", ")}`,
          prioridade: "media"
        });
      }

      return new Response(JSON.stringify({ 
        alertas,
        proximoHorario,
        gruposAtrasados,
        gruposQuentes: gruposParaProximoHorario
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Ação não reconhecida" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Erro:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
