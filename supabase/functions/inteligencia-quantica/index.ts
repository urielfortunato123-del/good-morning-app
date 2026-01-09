import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
      // Buscar dados históricos para análise
      const { data: resultados } = await supabase
        .from("resultados_historicos")
        .select("*")
        .order("data", { ascending: false })
        .limit(100);

      const { data: padroes } = await supabase
        .from("padroes_aprendidos")
        .select("*")
        .order("peso", { ascending: false })
        .limit(50);

      const { data: previsoes } = await supabase
        .from("previsoes_quanticas")
        .select("*")
        .not("acertou", "is", null)
        .order("created_at", { ascending: false })
        .limit(50);

      const { data: metricas } = await supabase
        .from("metricas_aprendizado")
        .select("*")
        .single();

      // Preparar contexto para a IA
      const contexto = {
        resultadosRecentes: resultados || [],
        padroesAprendidos: padroes || [],
        historicoPrevisoes: previsoes || [],
        metricas: metricas || { taxa_acerto: 0, total_acertos: 0 },
        horarioSolicitado: data.horario,
        modalidade: data.modalidade,
        digitos: data.digitos,
      };

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
              content: `Você é uma Inteligência Quântica Matemática especializada em análise de padrões numéricos do Jogo do Bicho brasileiro.

REGRAS DO JOGO:
- São 25 grupos de animais, cada um com 4 dezenas (01-00)
- Grupo 1 (Avestruz): 01-04, Grupo 2 (Águia): 05-08... até Grupo 25 (Vaca): 97-00
- A dezena 00 pertence ao grupo 25

SEU OBJETIVO:
Analisar os dados históricos fornecidos e identificar padrões para gerar previsões com alta probabilidade de acerto.

MÉTODOS DE ANÁLISE:
1. Frequência estatística de grupos e dezenas
2. Padrões de repetição e sequências
3. Correlação horário x grupo
4. Tendências semanais
5. Ciclos de aparição
6. Análise de lacunas (grupos/dezenas que estão "atrasados")

FORMATO DA RESPOSTA (JSON):
{
  "numeros": ["array de ${contexto.digitos} dígitos"],
  "grupos": [números dos grupos recomendados],
  "confianca": número de 1-100,
  "explicacao": "análise detalhada dos padrões encontrados",
  "padroesIdentificados": ["lista de padrões"],
  "gruposQuentes": [grupos com alta frequência recente],
  "gruposFrios": [grupos atrasados que podem sair],
  "recomendacaoEspecial": "dica baseada nos dados"
}`
            },
            {
              role: "user",
              content: `Analise os seguintes dados e gere números para ${data.digitos} dígitos no horário ${data.horario}:

RESULTADOS RECENTES (${contexto.resultadosRecentes.length} registros):
${JSON.stringify(contexto.resultadosRecentes.slice(0, 30), null, 2)}

PADRÕES JÁ APRENDIDOS:
${JSON.stringify(contexto.padroesAprendidos, null, 2)}

MÉTRICAS ATUAIS:
Taxa de acerto: ${contexto.metricas.taxa_acerto}%
Total de acertos: ${contexto.metricas.total_acertos}
Melhor grupo: ${contexto.metricas.melhor_grupo || "Ainda aprendendo"}
Melhor horário: ${contexto.metricas.melhor_horario || "Ainda aprendendo"}

Gere 5 números otimizados com base nos padrões identificados.`
            }
          ],
          temperature: 0.3,
        }),
      });

      if (!aiResponse.ok) {
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
      
      // Tentar parsear JSON da resposta
      let resultado;
      try {
        // Extrair JSON do markdown se necessário
        const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
        const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
        resultado = JSON.parse(jsonStr);
      } catch {
        // Fallback se não conseguir parsear
        resultado = {
          numeros: [],
          grupos: [],
          confianca: 50,
          explicacao: content,
          padroesIdentificados: [],
          gruposQuentes: [],
          gruposFrios: [],
          recomendacaoEspecial: "Análise em texto livre"
        };
      }

      // Salvar previsão para tracking
      const grupos = resultado.grupos || [];
      await supabase.from("previsoes_quanticas").insert({
        data_previsao: new Date().toISOString().split('T')[0],
        horario: data.horario,
        numeros: resultado.numeros || [],
        grupos: grupos,
        confianca: resultado.confianca || 50,
        metodos_usados: resultado.padroesIdentificados || ["IA Quântica"],
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

      // Atualizar padrões aprendidos
      // Padrão de grupo
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

      // Padrão de horário + grupo
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

      // Verificar previsões anteriores e marcar acertos
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

        if (acertouNumero || acertouGrupo) acertou = true;
      }

      // Atualizar métricas
      const { data: metricas } = await supabase
        .from("metricas_aprendizado")
        .select("*")
        .single();

      if (metricas) {
        const novoTotal = metricas.total_previsoes + 1;
        const novosAcertos = metricas.total_acertos + (acertou ? 1 : 0);
        const novaTaxa = (novosAcertos / novoTotal) * 100;

        await supabase.from("metricas_aprendizado")
          .update({
            total_previsoes: novoTotal,
            total_acertos: novosAcertos,
            taxa_acerto: novaTaxa,
            ultima_atualizacao: new Date().toISOString()
          })
          .eq("id", metricas.id);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        grupo, 
        animal,
        acertou,
        mensagem: acertou ? "🎉 Acerto registrado!" : "Resultado registrado para aprendizado"
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
        .limit(10);

      const { data: ultimasPrevisoes } = await supabase
        .from("previsoes_quanticas")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      return new Response(JSON.stringify({ 
        metricas,
        topPadroes,
        ultimasPrevisoes
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
