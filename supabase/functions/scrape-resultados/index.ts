import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BASE = (uf: string, date: string) =>
  `https://www.resultadofacil.com.br/resultado-do-jogo-do-bicho/${uf}/do-dia/${date}`;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function isoDate(y: number, m: number, d: number): string {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function parseTitle(text: string): { hora: string; extracao: string } | null {
  const t = text.replace(/\s+/g, " ").trim();
  const mh = t.match(/\b(\d{1,2}:\d{2})\b/);
  if (!mh) return null;
  const hora = mh[1];

  let extracao = "EXTRACAO";
  const m1 = t.match(new RegExp(`${hora}\\s*,\\s*([^,]+)`));
  if (m1 && m1[1]) extracao = m1[1].trim();

  return { hora, extracao };
}

function extractRows($: cheerio.CheerioAPI, $table: cheerio.Cheerio<cheerio.Element>): Array<{
  premio: number;
  milhar: string;
  grupo: string;
  bicho: string;
}> {
  const rows: Array<{ premio: number; milhar: string; grupo: string; bicho: string }> = [];
  
  $table.find("tr").each((_, tr) => {
    const cols: string[] = [];
    $(tr).find("th,td").each((__, td) => {
      cols.push($(td).text().trim());
    });

    if (cols.length < 4) return;

    const c0 = (cols[0] || "").toLowerCase();
    const c1 = (cols[1] || "").toLowerCase();
    if (c0.startsWith("prê") || c1.startsWith("milh")) return;

    const premio = (cols[0] || "").replace("º", "").trim();
    if (!/^\d+$/.test(premio)) return;

    const milhar = (cols[1] || "").trim();
    const grupo = (cols[2] || "").trim();
    const bicho = (cols[3] || "").trim();

    if (!milhar || milhar.startsWith("[")) return;

    rows.push({
      premio: Number(premio),
      milhar,
      grupo,
      bicho
    });
  });
  
  return rows;
}

interface ResultRow {
  data: string;
  uf: string;
  hora: string;
  extracao: string;
  premio: number;
  milhar: string;
  grupo: string;
  bicho: string;
}

async function fetchDay(uf: string, date: string, timeoutMs = 30000): Promise<ResultRow[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const url = BASE(uf, date);
  console.log(`Fetching: ${url}`);
  
  const res = await fetch(url, {
    signal: controller.signal,
    headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" }
  });
  clearTimeout(timer);

  if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
  const html = await res.text();

  const $ = cheerio.load(html);
  const data: ResultRow[] = [];

  $("h2,h3,h4").each((_, el) => {
    const title = $(el).text();
    const info = parseTitle(title);
    if (!info) return;

    const $table = $(el).nextAll("table").first();
    if (!$table || $table.length === 0) return;

    const rows = extractRows($, $table);
    for (const r of rows) {
      data.push({
        data: date,
        uf: uf.toUpperCase(),
        hora: info.hora,
        extracao: info.extracao,
        ...r
      });
    }
  });

  console.log(`Found ${data.length} rows for ${date}`);
  return data;
}

function toCSV(items: ResultRow[]): string {
  const header = ["data", "uf", "hora", "extracao", "premio", "milhar", "grupo", "bicho"];
  const lines = [header.join(",")];
  for (const it of items) {
    const line = header.map(k => {
      const v = (it[k as keyof ResultRow] ?? "").toString();
      if (v.includes(",") || v.includes('"') || v.includes("\n")) {
        return `"${v.replace(/"/g, '""')}"`;
      }
      return v;
    }).join(",");
    lines.push(line);
  }
  return lines.join("\n");
}

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const uf = (url.searchParams.get("uf") || "RJ").toUpperCase();
    const mode = url.searchParams.get("mode") || "today"; // today | range | year
    const format = (url.searchParams.get("format") || "json").toLowerCase();
    const saveToDb = url.searchParams.get("save") === "true";
    
    // Para modo range/year
    const startDate = url.searchParams.get("start");
    const endDate = url.searchParams.get("end");
    const year = url.searchParams.get("year");

    if (!/^[A-Z]{2}$/.test(uf)) {
      return new Response(JSON.stringify({ error: "UF inválida. Ex: RJ, SP, MG" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let allResults: ResultRow[] = [];

    if (mode === "today") {
      // Busca apenas hoje
      const today = new Date();
      const dateStr = isoDate(today.getFullYear(), today.getMonth() + 1, today.getDate());
      allResults = await fetchDay(uf, dateStr);
      
    } else if (mode === "range" && startDate && endDate) {
      // Busca intervalo de datas
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Limite de 30 dias para não estourar timeout
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 30) {
        return new Response(JSON.stringify({ error: "Intervalo máximo: 30 dias" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = isoDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
        try {
          const rows = await fetchDay(uf, dateStr);
          allResults.push(...rows);
        } catch (e) {
          console.error(`Erro em ${dateStr}:`, e);
        }
        await sleep(350);
      }
      
    } else if (mode === "single" && startDate) {
      // Busca data específica
      allResults = await fetchDay(uf, startDate);
    }

    // Salvar no banco se solicitado
    if (saveToDb && allResults.length > 0) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Converte para formato do banco
      const dbRows = allResults.map(r => ({
        data: r.data,
        horario: r.hora,
        premio: r.premio,
        milhar: r.milhar,
        dezena: r.milhar.slice(-2),
        grupo: parseInt(r.grupo) || 0,
        animal: r.bicho,
      }));

      // Upsert para evitar duplicatas
      const { error } = await supabase
        .from('resultados_historicos')
        .upsert(dbRows, { 
          onConflict: 'data,horario,premio',
          ignoreDuplicates: true 
        });

      if (error) {
        console.error('Erro ao salvar:', error);
      } else {
        console.log(`Salvos ${dbRows.length} resultados no banco`);
      }
    }

    if (format === "csv") {
      const csv = toCSV(allResults);
      return new Response(csv, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${uf}_resultados.csv"`
        },
      });
    }

    return new Response(JSON.stringify({ 
      uf, 
      mode,
      count: allResults.length, 
      items: allResults 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err: unknown) {
    console.error('Erro no scraping:', err);
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
