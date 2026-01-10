import { ANIMAIS, SIGNOS } from "@/data/bichoData";
import { 
  GRUPOS_QUENTES, 
  DEZENAS_QUENTES, 
  FREQUENCIA_POR_HORARIO,
  TENDENCIAS_SEMANAIS,
  PADROES_REPETICAO,
  getHorarioAtual,
  calcularProbabilidade,
  getGruposRecomendados,
  MILHARES_FREQUENTES,
  CENTENAS_FREQUENTES
} from "@/data/historicalData";
import { getAcertosFromStorage } from "@/hooks/useAcertosHistorico";

// Fibonacci sequence
const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

// Tesla 369 pattern
const tesla369 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99];

// Biblical numbers
const biblicalNumbers = [3, 7, 12, 40, 70, 77, 144, 666, 777, 888, 1000];

// Kabbalistic numbers (Tree of Life)
const kabbalisticNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33];

// Gerador de números pseudo-aleatórios baseado em seed
const seededRandom = (seed: number): () => number => {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
};

// Criar seed baseada na data, horário, minuto e categoria (digitos) - cada categoria gera números diferentes
const createSeed = (data?: string, horario?: string, digitos?: number): number => {
  const now = new Date();
  const dataStr = data || now.toISOString().split('T')[0];
  const horaStr = horario || `${now.getHours()}:${now.getMinutes()}`;
  // Incluir digitos na seed para gerar números diferentes por categoria
  const seedString = `${dataStr}-${horaStr}-${now.getMinutes()}-digitos${digitos || 2}`;
  
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

let currentRandom: () => number = Math.random;

const getRandomFromArray = <T>(arr: T[], count: number = 1): T[] => {
  const shuffled = [...arr].sort(() => currentRandom() - 0.5);
  return shuffled.slice(0, count);
};

const padNumber = (num: number, digits: number): string => {
  return num.toString().padStart(digits, '0').slice(-digits);
};

const reduceToDigits = (num: number, digits: number): string => {
  let result = num % Math.pow(10, digits);
  return padNumber(result, digits);
};

const sumDigits = (num: number): number => {
  return num.toString().split('').reduce((a, b) => a + parseInt(b), 0);
};

const getCurrentAstralInfluence = (): number => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const hour = now.getHours();
  return (day * month + hour) % 100;
};

const getMoonPhaseNumber = (): number => {
  const now = new Date();
  const lunarCycle = 29.53;
  const knownNewMoon = new Date('2024-01-11');
  const daysSinceNew = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const phase = (daysSinceNew % lunarCycle) / lunarCycle;
  return Math.floor(phase * 100);
};

// Nova função: gerar números baseados em dados históricos
const gerarNumerosHistoricos = (digitos: number): string[] => {
  const horario = getHorarioAtual();
  const gruposRecomendados = getGruposRecomendados(horario);
  const diaSemana = new Date().getDay();
  const tendenciaDia = TENDENCIAS_SEMANAIS[diaSemana] || [];
  
  // Combinar grupos recomendados com tendência do dia
  const gruposPrioritarios = [...new Set([...gruposRecomendados.slice(0, 3), ...tendenciaDia.slice(0, 2)])];
  
  const numeros: string[] = [];
  
  for (const grupo of gruposPrioritarios.slice(0, 3)) {
    const animal = ANIMAIS.find(a => a.grupo === grupo);
    if (animal) {
      const dezena = getRandomFromArray(animal.numeros, 1)[0];
        if (digitos === 2) {
          numeros.push(dezena);
        } else if (digitos === 3) {
          const centena = Math.floor(currentRandom() * 10);
          numeros.push(`${centena}${dezena}`);
        } else {
          const milhar = Math.floor(currentRandom() * 100);
          numeros.push(padNumber(milhar, 2) + dezena);
        }
    }
  }
  
  return numeros;
};

// Nova função: gerar dezenas baseadas em frequência
const gerarDezenasFrequentes = (count: number = 3): string[] => {
  const dezenasOrdenadas = [...DEZENAS_QUENTES]
    .sort((a, b) => b.frequencia - a.frequencia);
  
  // Selecionar com peso para as mais frequentes
  const selecionadas: string[] = [];
  for (let i = 0; i < count && i < dezenasOrdenadas.length; i++) {
    // Adicionar variação aleatória
    if (currentRandom() > 0.3 || selecionadas.length < 2) {
      selecionadas.push(dezenasOrdenadas[i].dezena);
    }
  }
  
  // Completar se necessário
  while (selecionadas.length < count) {
    const random = getRandomFromArray(dezenasOrdenadas, 1)[0];
    if (!selecionadas.includes(random.dezena)) {
      selecionadas.push(random.dezena);
    }
  }
  
  return selecionadas;
};

// Função para obter estatísticas dos acertos do usuário
const getEstatisticasAcertos = () => {
  const acertos = getAcertosFromStorage();
  
  const frequenciaGrupos: Record<number, number> = {};
  const frequenciaMetodos: Record<string, number> = {};
  const frequenciaHorarios: Record<string, number> = {};
  const frequenciaNumeros: Record<string, number> = {};
  
  acertos.forEach(a => {
    if (a.grupo) {
      frequenciaGrupos[a.grupo] = (frequenciaGrupos[a.grupo] || 0) + 1;
    }
    a.metodosUsados?.forEach(m => {
      frequenciaMetodos[m] = (frequenciaMetodos[m] || 0) + 1;
    });
    frequenciaHorarios[a.horario] = (frequenciaHorarios[a.horario] || 0) + 1;
    a.numeros?.forEach(n => {
      frequenciaNumeros[n] = (frequenciaNumeros[n] || 0) + 1;
    });
  });
  
  const gruposTop = Object.entries(frequenciaGrupos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([grupo, freq]) => ({ grupo: parseInt(grupo), frequencia: freq }));
  
  const metodosTop = Object.entries(frequenciaMetodos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([metodo, freq]) => ({ metodo, frequencia: freq }));
  
  const numerosTop = Object.entries(frequenciaNumeros)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([numero, freq]) => ({ numero, frequencia: freq }));

  return { 
    gruposTop, 
    metodosTop, 
    numerosTop,
    frequenciaHorarios,
    totalAcertos: acertos.length 
  };
};

export interface AnalysisResult {
  numeros: string[];
  grupo?: typeof ANIMAIS[0];
  metodo: string;
  explicacao: string;
  energia: string;
  confianca: number;
  gruposQuentes?: { grupo: number; nome: string; status: string }[];
  horarioAnalise?: string;
  metodosUsados?: string[];
  usouAcertosHistoricos?: boolean;
}

// Função principal: Canal Magnético - combina TODOS os métodos
export const generateCanalMagnetico = (digitos: number, horarioSelecionado?: string, dataSelecionada?: string): AnalysisResult => {
  // Inicializar gerador de números baseado na data, horário e categoria (digitos)
  const seed = createSeed(dataSelecionada, horarioSelecionado, digitos);
  currentRandom = seededRandom(seed);
  
  const now = dataSelecionada ? new Date(dataSelecionada) : new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const hour = now.getHours();
  const diaSemana = now.getDay();
  const horarioAtual = horarioSelecionado || getHorarioAtual();
  
  // NOVO: Obter estatísticas dos acertos do usuário
  const statsAcertos = getEstatisticasAcertos();
  const usouAcertosHistoricos = statsAcertos.totalAcertos > 0;
  
  // Coletar números de TODOS os métodos
  const todosNumeros: Map<string, number> = new Map(); // número -> peso
  
  // 0. PRIORIDADE MÁXIMA: Números que já acertaram antes (baseado no histórico do usuário)
  if (statsAcertos.numerosTop.length > 0) {
    statsAcertos.numerosTop.forEach(({ numero, frequencia }) => {
      const peso = Math.min(frequencia * 8, 30);
      todosNumeros.set(numero, (todosNumeros.get(numero) || 0) + peso);
    });
  }
  
  // 0.1. Grupos que historicamente mais acertaram
  if (statsAcertos.gruposTop.length > 0) {
    statsAcertos.gruposTop.forEach(({ grupo, frequencia }) => {
      const animal = ANIMAIS.find(a => a.grupo === grupo);
      if (animal) {
        animal.numeros.forEach(n => {
          const peso = Math.min(frequencia * 6, 25);
          todosNumeros.set(n, (todosNumeros.get(n) || 0) + peso);
        });
      }
    });
  }
  
  // 1. FIBONACCI + HISTÓRICO
  const fibIndices = getRandomFromArray(fibonacci, 3);
  const dezenasQuentes = gerarDezenasFrequentes(3);
  dezenasQuentes.forEach(d => {
    const num = digitos === 2 ? d : reduceToDigits(parseInt(d) + fibIndices[0] * 10, digitos);
    todosNumeros.set(num, (todosNumeros.get(num) || 0) + 2);
  });
  
  // 2. TESLA 369
  const teslaBase = tesla369.filter(n => n <= 99);
  const gruposHot = GRUPOS_QUENTES.slice(0, 3).map(g => g.grupo);
  const numerosAnimal = gruposHot.flatMap(g => ANIMAIS.find(a => a.grupo === g)?.numeros || []);
  teslaBase.slice(0, 5).forEach(n => {
    const num = reduceToDigits(n + hour, digitos);
    const peso = numerosAnimal.includes(padNumber(n % 100, 2)) ? 3 : 1;
    todosNumeros.set(num, (todosNumeros.get(num) || 0) + peso);
  });
  
  // 3. NUMEROLOGIA
  const lifeNumber = sumDigits(day + month + sumDigits(year));
  const personalYear = sumDigits(day + month + sumDigits(2026));
  const grupoNumerologico = GRUPOS_QUENTES[lifeNumber % 5];
  const animalNum = ANIMAIS.find(a => a.grupo === grupoNumerologico.grupo);
  if (animalNum) {
    animalNum.numeros.forEach(n => {
      const num = digitos === 2 ? n : reduceToDigits(parseInt(n) + lifeNumber * 10, digitos);
      todosNumeros.set(num, (todosNumeros.get(num) || 0) + 3);
    });
  }
  
  // 4. ASTROLOGIA + TENDÊNCIAS
  const tendenciasHoje = TENDENCIAS_SEMANAIS[diaSemana] || [];
  tendenciasHoje.forEach(grupo => {
    const animal = ANIMAIS.find(a => a.grupo === grupo);
    if (animal) {
      animal.numeros.forEach(n => {
        const num = digitos === 2 ? n : reduceToDigits(parseInt(n) + day * 10, digitos);
        todosNumeros.set(num, (todosNumeros.get(num) || 0) + 2);
      });
    }
  });
  
  // 5. CÓSMICO (Fase Lunar)
  const moonNum = getMoonPhaseNumber();
  const indexLunar = moonNum % GRUPOS_QUENTES.length;
  const grupoLunar = GRUPOS_QUENTES[indexLunar];
  const animalLunar = ANIMAIS.find(a => a.grupo === grupoLunar.grupo);
  if (animalLunar) {
    animalLunar.numeros.forEach(n => {
      todosNumeros.set(n, (todosNumeros.get(n) || 0) + 4);
    });
  }
  
  // 6. QUÂNTICA (Grupos por Horário)
  const gruposRecomendados = getGruposRecomendados(horarioAtual);
  gruposRecomendados.forEach(grupo => {
    const animal = ANIMAIS.find(a => a.grupo === grupo);
    if (animal) {
      animal.numeros.forEach(n => {
        const num = digitos === 2 ? n : reduceToDigits(parseInt(n) + Math.floor(currentRandom() * 90) * 10, digitos);
        todosNumeros.set(num, (todosNumeros.get(num) || 0) + 5); // Maior peso para dados históricos
      });
    }
  });
  
  // 7. LEI DA ATRAÇÃO (Grupos Ultra Hot)
  GRUPOS_QUENTES.filter(g => g.status === 'ultra_hot' || g.status === 'hot').forEach(g => {
    const animal = ANIMAIS.find(a => a.grupo === g.grupo);
    if (animal) {
      animal.numeros.forEach(n => {
        const peso = g.status === 'ultra_hot' ? 6 : 4;
        todosNumeros.set(n, (todosNumeros.get(n) || 0) + peso);
      });
    }
  });
  
  // 8. KABBALAH
  const selectedKabba = getRandomFromArray(kabbalisticNumbers, 2);
  selectedKabba.forEach(k => {
    const num = reduceToDigits(k * (day % 10 + 1), digitos);
    todosNumeros.set(num, (todosNumeros.get(num) || 0) + 2);
  });
  
  // 9. BÍBLIA
  const selectedBiblical = getRandomFromArray(biblicalNumbers.filter(n => n < 100), 2);
  selectedBiblical.forEach(b => {
    const num = reduceToDigits(b, digitos);
    todosNumeros.set(num, (todosNumeros.get(num) || 0) + 2);
  });
  
  // 10. MAGIA (Lo Shu)
  const magicSquare = [2, 7, 6, 9, 5, 1, 4, 3, 8];
  const grupoMagico = GRUPOS_QUENTES.find(g => g.status === 'ultra_hot') || GRUPOS_QUENTES[0];
  const animalMagico = ANIMAIS.find(a => a.grupo === grupoMagico.grupo);
  if (animalMagico) {
    animalMagico.numeros.forEach(n => {
      todosNumeros.set(n, (todosNumeros.get(n) || 0) + 5);
    });
  }
  
  // Seleção final: amostragem ponderada (evita ficar preso sempre nos mesmos top 5)
  const entriesOrdenadas = [...todosNumeros.entries()].sort((a, b) => b[1] - a[1]);
  const pool = entriesOrdenadas.slice(0, 40); // limita para manter relevância

  const pickWeightedUnique = (entries: Array<[string, number]>, count: number): string[] => {
    const picked: string[] = [];
    const used = new Set<string>();

    for (let i = 0; i < count && entries.length > 0; i++) {
      const available = entries.filter(([n]) => !used.has(n));
      if (available.length === 0) break;

      const totalWeight = available.reduce((acc, [, w]) => acc + Math.max(w, 0.01), 0);
      let r = currentRandom() * totalWeight;

      for (const [n, w] of available) {
        r -= Math.max(w, 0.01);
        if (r <= 0) {
          used.add(n);
          picked.push(n);
          break;
        }
      }
    }

    return picked;
  };

  let numerosFinais = pickWeightedUnique(pool, 5);

  // Formatar corretamente
  numerosFinais = numerosFinais.map(n => {
    if (digitos === 2) return n.slice(-2).padStart(2, '0');
    if (digitos === 3) return n.slice(-3).padStart(3, '0');
    return n.slice(-4).padStart(4, '0');
  });

  // Remover duplicatas (por segurança) e garantir tamanho
  numerosFinais = [...new Set(numerosFinais)].slice(0, 5);
  
  // Encontrar grupo do número principal
  const dezena = numerosFinais[0]?.slice(-2) || "00";
  const grupo = ANIMAIS.find(a => a.numeros.includes(dezena));
  
  // Grupos quentes para exibição
  const gruposQuentes = GRUPOS_QUENTES.slice(0, 5).map(g => {
    const animal = ANIMAIS.find(a => a.grupo === g.grupo);
    return {
      grupo: g.grupo,
      nome: animal?.nome || "Desconhecido",
      status: g.status === 'ultra_hot' ? '🔥🔥🔥' : g.status === 'hot' ? '🔥🔥' : g.status === 'warm' ? '🔥' : '✓'
    };
  });
  
  // Calcular confiança baseada na convergência
  const formatKey = (n: string): string => {
    if (digitos === 2) return n.slice(-2).padStart(2, '0');
    if (digitos === 3) return n.slice(-3).padStart(3, '0');
    return n.slice(-4).padStart(4, '0');
  };

  const pesoMaximo = Math.max(
    1,
    ...pool
      .filter(([raw]) => formatKey(raw) === (numerosFinais[0] || ''))
      .map(([, w]) => w)
  );
  const confianca = Math.min(75 + Math.floor(pesoMaximo * 2), 98);
  
  const metodosUsados = usouAcertosHistoricos
    ? ["🏆 Acertos Históricos", "📊 Estatística", "🌀 Fibonacci", "⚡ Tesla 369", 
       "🔢 Numerologia", "♈ Astrologia", "🌙 Lunar", "⚛️ Quântica", 
       "🧲 Atração", "✡️ Kabbalah", "📖 Bíblia", "✨ Magia Lo Shu"]
    : ["📊 Estatística", "🌀 Fibonacci", "⚡ Tesla 369", 
       "🔢 Numerologia", "♈ Astrologia", "🌙 Lunar",
       "⚛️ Quântica", "🧲 Atração", "✡️ Kabbalah", 
       "📖 Bíblia", "✨ Magia Lo Shu"];
  
  const explicacaoBase = `💰 CANAL MAGNÉTICO ATIVADO! ${metodosUsados.length} métodos convergem para estes números.`;
  const explicacaoAcertos = usouAcertosHistoricos 
    ? ` 🏆 ${statsAcertos.totalAcertos} acertos anteriores priorizados!` 
    : "";
  const explicacaoFinal = `${explicacaoBase}${explicacaoAcertos} Fase lunar ${moonNum}% + ${gruposQuentes[0].nome} ultra hot + tendência ${['DOM','SEG','TER','QUA','QUI','SEX','SÁB'][diaSemana]} = MÁXIMA ENERGIA DE PROSPERIDADE! Horário ${horarioAtual} potencializa a vibração.`;
  
  return {
    numeros: numerosFinais,
    grupo,
    metodo: "canal-magnetico",
    explicacao: explicacaoFinal,
    energia: usouAcertosHistoricos ? "🏆 SORTE AMPLIFICADA 🏆" : "💰 MÁXIMA PROSPERIDADE 💰",
    confianca: usouAcertosHistoricos ? Math.min(confianca + 5, 99) : confianca,
    gruposQuentes,
    horarioAnalise: horarioAtual,
    metodosUsados,
    usouAcertosHistoricos
  };
};

// Mantém função antiga para compatibilidade
export const generateAnalysis = (metodoId: string, digitos: number): AnalysisResult => {
  // Sempre usar o canal magnético agora
  return generateCanalMagnetico(digitos);
};
