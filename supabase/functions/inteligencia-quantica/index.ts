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
      console.log("Iniciando análise quântica...");
      
      // Buscar dados históricos para análise
      const { data: resultados } = await supabase
        .from("resultados_historicos")
        .select("*")
        .order("data", { ascending: false })
        .limit(200);

      const { data: padroes } = await supabase
        .from("padroes_aprendidos")
        .select("*")
        .order("peso", { ascending: false })
        .limit(100);

      const { data: previsoes } = await supabase
        .from("previsoes_quanticas")
        .select("*")
        .not("acertou", "is", null)
        .order("created_at", { ascending: false })
        .limit(100);

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
      const gruposProvaveis = ultimoGrupo ? analiseSequencias.gruposAposGrupo[ultimoGrupo] : {};
      
      // Grupos que mais saíram após o último grupo
      const proximosProvaveis = Object.entries(gruposProvaveis || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([g, freq]) => ({ grupo: parseInt(g), frequencia: freq }));

      // Métricas de métodos que mais acertam
      const metodosQueAcertam = (padroes || [])
        .filter(p => p.taxa_acerto && p.taxa_acerto > 0)
        .sort((a, b) => (b.taxa_acerto || 0) - (a.taxa_acerto || 0))
        .slice(0, 10);

      // Preparar contexto enriquecido para a IA
      const contexto = {
        resultadosRecentes: (resultados || []).slice(0, 50),
        padroesAprendidos: padroes || [],
        historicoPrevisoes: previsoes || [],
        metricas: metricas || { taxa_acerto: 0, total_acertos: 0 },
        horarioSolicitado: data.horario,
        modalidade: data.modalidade,
        digitos: data.digitos,
        // Novas análises
        analiseAvancada: {
          sequenciasFrequentes: analiseSequencias.sequencias,
          gruposAtrasados,
          gruposProvaveis: proximosProvaveis,
          correlacaoHorario: correlacaoHorario[data.horario] || [],
          tendenciaHoje: tendenciaSemanal[new Date().getDay()] || [],
          ultimoGrupoSaiu: ultimoGrupo,
          metodosQueAcertam: metodosQueAcertam.map(m => ({ tipo: m.tipo, valor: m.valor, taxa: m.taxa_acerto }))
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

MÉTODOS AVANÇADOS DE ANÁLISE:
1. **Análise de Sequências**: Identificar padrões de grupos que saem em sequência
2. **Grupos Atrasados**: Grupos que estão há muito tempo sem sair tendem a aparecer
3. **Correlação Horário**: Cada horário tem grupos que aparecem mais
4. **Transição de Grupos**: Após o grupo X, qual grupo Y tende a sair?
5. **Ciclos Semanais**: Padrões que se repetem em dias específicos
6. **Peso Dinâmico**: Métodos que acertaram mais recebem mais peso
7. **Frequência Recente vs Histórica**: Balancear tendências recentes com padrões de longo prazo

PRIORIDADES:
1. GRUPOS ATRASADOS têm alta probabilidade de sair
2. SEQUÊNCIAS que se repetem são fortes indicadores
3. HORÁRIO específico tem grupos preferenciais
4. Último grupo que saiu indica próximos prováveis

FORMATO DA RESPOSTA (JSON OBRIGATÓRIO):
{
  "numeros": ["array de strings com ${data.digitos} dígitos cada"],
  "grupos": [números inteiros dos grupos recomendados],
  "confianca": número de 1-100,
  "explicacao": "análise detalhada dos padrões encontrados",
  "padroesIdentificados": ["lista de padrões usados"],
  "gruposQuentes": [grupos com alta frequência recente],
  "gruposFrios": [grupos atrasados que podem sair],
  "recomendacaoEspecial": "dica principal baseada nos dados"
}`
            },
            {
              role: "user",
              content: `ANÁLISE PARA ${data.digitos} DÍGITOS - HORÁRIO ${data.horario}

📊 DADOS ESTATÍSTICOS:
- Total de resultados analisados: ${contexto.resultadosRecentes.length}
- Taxa de acerto atual: ${contexto.metricas.taxa_acerto?.toFixed(1) || 0}%
- Total de acertos: ${contexto.metricas.total_acertos || 0}

🎯 ÚLTIMO RESULTADO:
- Grupo: ${contexto.analiseAvancada.ultimoGrupoSaiu || "N/A"}
- Grupos que costumam sair após este: ${JSON.stringify(contexto.analiseAvancada.gruposProvaveis)}

⏰ CORRELAÇÃO COM HORÁRIO ${data.horario}:
${JSON.stringify(contexto.analiseAvancada.correlacaoHorario, null, 2)}

📈 TENDÊNCIA PARA HOJE (dia ${new Date().getDay()}):
Grupos favoritos: ${JSON.stringify(contexto.analiseAvancada.tendenciaHoje)}

🔥 GRUPOS ATRASADOS (alta probabilidade):
${JSON.stringify(contexto.analiseAvancada.gruposAtrasados, null, 2)}

🔄 SEQUÊNCIAS MAIS FREQUENTES:
${JSON.stringify(contexto.analiseAvancada.sequenciasFrequentes.slice(0, 5), null, 2)}

📚 PADRÕES COM MAIOR TAXA DE ACERTO:
${JSON.stringify(contexto.analiseAvancada.metodosQueAcertam, null, 2)}

ÚLTIMOS 20 RESULTADOS:
${JSON.stringify(contexto.resultadosRecentes.slice(0, 20).map(r => ({ g: r.grupo, h: r.horario, d: r.dezena })), null, 2)}

Gere 5 números otimizados priorizando: grupos atrasados + correlação de horário + sequências frequentes.`
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
