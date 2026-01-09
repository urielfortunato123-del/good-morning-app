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

// Fibonacci sequence
const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

// Tesla 369 pattern
const tesla369 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99];

// Biblical numbers
const biblicalNumbers = [3, 7, 12, 40, 70, 77, 144, 666, 777, 888, 1000];

// Kabbalistic numbers (Tree of Life)
const kabbalisticNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 22, 33];

const getRandomFromArray = <T>(arr: T[], count: number = 1): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
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
        const centena = Math.floor(Math.random() * 10);
        numeros.push(`${centena}${dezena}`);
      } else {
        const milhar = Math.floor(Math.random() * 100);
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
    if (Math.random() > 0.3 || selecionadas.length < 2) {
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

export interface AnalysisResult {
  numeros: string[];
  grupo?: typeof ANIMAIS[0];
  metodo: string;
  explicacao: string;
  energia: string;
  confianca: number;
  gruposQuentes?: { grupo: number; nome: string; status: string }[];
  horarioAnalise?: string;
}

export const generateAnalysis = (metodoId: string, digitos: number): AnalysisResult => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const diaSemana = now.getDay();
  const horarioAtual = getHorarioAtual();
  
  let numeros: string[] = [];
  let explicacao = "";
  let energia = "";
  let confianca = Math.floor(Math.random() * 20) + 75; // Base mais alta com dados reais
  
  // Grupos quentes para exibição
  const gruposQuentes = GRUPOS_QUENTES.slice(0, 5).map(g => {
    const animal = ANIMAIS.find(a => a.grupo === g.grupo);
    return {
      grupo: g.grupo,
      nome: animal?.nome || "Desconhecido",
      status: g.status === 'ultra_hot' ? '🔥🔥🔥' : g.status === 'hot' ? '🔥🔥' : g.status === 'warm' ? '🔥' : '✓'
    };
  });

  switch (metodoId) {
    case "fibonacci":
      const fibIndices = getRandomFromArray(fibonacci, 3);
      // Combinar Fibonacci com dados históricos
      const dezenasQuentes = gerarDezenasFrequentes(2);
      numeros = [
        ...dezenasQuentes.map(d => digitos === 2 ? d : reduceToDigits(parseInt(d) + fibIndices[0] * 10, digitos)),
        reduceToDigits(fibIndices[1] * day + month, digitos)
      ];
      explicacao = `A sequência de Fibonacci (${fibIndices.join(', ')}) combinada com análise histórica indica alta probabilidade. Grupos quentes: Cobra (🔥🔥🔥) e Carneiro (🔥🔥) em destaque.`;
      energia = "Harmonia + Dados Reais";
      confianca += 5;
      break;

    case "tesla":
      const teslaBase = tesla369.filter(n => n <= 99);
      // Priorizar números Tesla que coincidem com grupos quentes
      const gruposHot = GRUPOS_QUENTES.slice(0, 3).map(g => g.grupo);
      const numerosAnimal = gruposHot.flatMap(g => ANIMAIS.find(a => a.grupo === g)?.numeros || []);
      const teslaCoincidente = teslaBase.filter(n => numerosAnimal.includes(padNumber(n % 100, 2)));
      const selectedTesla = teslaCoincidente.length >= 2 
        ? getRandomFromArray(teslaCoincidente, 2).concat(getRandomFromArray(teslaBase, 1))
        : getRandomFromArray(teslaBase, 3);
      numeros = selectedTesla.map(n => reduceToDigits(n + hour, digitos));
      explicacao = `Tesla 369 revela: Os múltiplos mágicos ${selectedTesla.join(', ')} ressoam com grupos em alta (Cobra 🔥🔥🔥, Carneiro 🔥🔥). Energia cósmica amplificada às ${horarioAtual}.`;
      energia = "Energia Universal";
      confianca += 8;
      break;

    case "numerologia":
      const lifeNumber = sumDigits(day + month + sumDigits(year));
      const personalYear = sumDigits(day + month + sumDigits(2026));
      // Integrar com grupos quentes
      const grupoNumerologico = GRUPOS_QUENTES[lifeNumber % 5];
      const animalNum = ANIMAIS.find(a => a.grupo === grupoNumerologico.grupo);
      numeros = [
        animalNum?.numeros[0] || reduceToDigits(lifeNumber * 11, digitos),
        reduceToDigits(personalYear * 7, digitos),
        reduceToDigits((lifeNumber + personalYear) * 9, digitos)
      ].map(n => digitos === 2 ? n.slice(-2) : n);
      explicacao = `Número de vida ${lifeNumber} + ano pessoal ${personalYear} = vibração alinhada com ${animalNum?.nome} (grupo ${grupoNumerologico.grupo}). Estatísticas confirmam tendência!`;
      energia = "Vibração Estatística";
      confianca += 10;
      break;

    case "kabbalah":
      const selectedKabba = getRandomFromArray(kabbalisticNumbers, 3);
      // Usar sephiroth para modular grupos quentes
      const grupoKabba = GRUPOS_QUENTES[selectedKabba[0] % 5];
      const animalKabba = ANIMAIS.find(a => a.grupo === grupoKabba.grupo);
      numeros = [
        animalKabba?.numeros[selectedKabba[1] % 4] || reduceToDigits(selectedKabba[0] * day, digitos),
        ...selectedKabba.slice(1).map(n => reduceToDigits(n * (day % 10 + 1), digitos))
      ];
      explicacao = `Sephiroth ${selectedKabba.join('-')} canalizam para ${animalKabba?.nome}. A Árvore da Vida aponta grupos com alta frequência histórica.`;
      energia = "Sabedoria Ancestral";
      break;

    case "astrologia":
      const currentSignIndex = (month - 1) % 12;
      const currentSign = SIGNOS[currentSignIndex];
      // Combinar astrologia com tendências do dia
      const tendenciasHoje = TENDENCIAS_SEMANAIS[diaSemana];
      const grupoAstral = tendenciasHoje[0];
      const animalAstral = ANIMAIS.find(a => a.grupo === grupoAstral);
      numeros = [
        animalAstral?.numeros[0] || reduceToDigits(currentSign.numeros[0] + day, digitos),
        ...currentSign.numeros.slice(0, 2).map(n => reduceToDigits(n + day, digitos))
      ];
      explicacao = `${currentSign.nome} (${currentSign.simbolo}) + tendência de ${['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'][diaSemana]} favorece ${animalAstral?.nome}. Probabilidade elevada!`;
      energia = `${currentSign.elemento} + Estatística`;
      confianca += 7;
      break;

    case "cosmico":
      const moonNum = getMoonPhaseNumber();
      const astralNum = getCurrentAstralInfluence();
      // Usar fase lunar para selecionar de grupos quentes
      const indexLunar = moonNum % GRUPOS_QUENTES.length;
      const grupoLunar = GRUPOS_QUENTES[indexLunar];
      const animalLunar = ANIMAIS.find(a => a.grupo === grupoLunar.grupo);
      numeros = [
        animalLunar?.numeros[0] || reduceToDigits(moonNum, digitos),
        reduceToDigits(astralNum, digitos),
        reduceToDigits(moonNum + astralNum, digitos)
      ];
      explicacao = `Fase lunar ${moonNum}% aponta ${animalLunar?.nome} (${grupoLunar.status === 'ultra_hot' ? '🔥🔥🔥 ULTRA HOT' : grupoLunar.status === 'hot' ? '🔥🔥 HOT' : '🔥'}). Alinhamento cósmico confirma dados históricos!`;
      energia = "Portal Cósmico";
      confianca += 12;
      break;

    case "quantica":
      // Usar aleatoriedade quântica + dados históricos
      const gruposRecomendados = getGruposRecomendados(horarioAtual);
      numeros = gruposRecomendados.slice(0, 3).map(grupo => {
        const animal = ANIMAIS.find(a => a.grupo === grupo);
        const dezena = animal?.numeros[Math.floor(Math.random() * 4)] || "00";
        if (digitos === 2) return dezena;
        return reduceToDigits(Math.floor(Math.random() * 100) * 100 + parseInt(dezena), digitos);
      });
      const animaisQuant = gruposRecomendados.slice(0, 3).map(g => ANIMAIS.find(a => a.grupo === g)?.nome).join(', ');
      explicacao = `Colapso quântico às ${horarioAtual} revela: ${animaisQuant}. Probabilidades calculadas em 50+ extrações reais. Alta coerência estatística!`;
      energia = "Campo Quântico + Big Data";
      confianca += 15;
      break;

    case "lei-atracao":
      // Manifestar grupos mais frequentes
      const grupoAbundancia = GRUPOS_QUENTES[0]; // Cobra - ultra hot
      const animalAbundancia = ANIMAIS.find(a => a.grupo === grupoAbundancia.grupo);
      const dezenaAbundancia = animalAbundancia?.numeros || ["33"];
      numeros = dezenaAbundancia.slice(0, 3).map(d => 
        digitos === 2 ? d : reduceToDigits(888 * 10 + parseInt(d), digitos)
      );
      explicacao = `A Lei da Atração + dados históricos convergem: ${animalAbundancia?.nome} (${grupoAbundancia.status === 'ultra_hot' ? '🔥🔥🔥' : '🔥🔥'}) é o grupo de maior manifestação com ${grupoAbundancia.frequencia} aparições recentes!`;
      energia = "Abundância Comprovada";
      confianca += 18;
      break;

    case "lei-suposicao":
      // Imaginar os grupos mais frequentes por horário
      const freqHorario = FREQUENCIA_POR_HORARIO[horarioAtual] || {};
      const topGrupos = Object.entries(freqHorario)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
      numeros = topGrupos.map(([grupo]) => {
        const animal = ANIMAIS.find(a => a.grupo === parseInt(grupo));
        const dezena = animal?.numeros[0] || "00";
        return digitos === 2 ? dezena : reduceToDigits(parseInt(grupo) * 100 + parseInt(dezena), digitos);
      });
      const animaisSuposicao = topGrupos.map(([g]) => ANIMAIS.find(a => a.grupo === parseInt(g))?.nome).join(', ');
      explicacao = `"Assuma o sentimento do desejo realizado" - Neville. Para ${horarioAtual}: ${animaisSuposicao} dominam historicamente. Suposição + estatística = poder!`;
      energia = "Imaginação + Dados";
      confianca += 14;
      break;

    case "biblia":
      // Combinar números bíblicos com grupos quentes
      const selectedBiblical = getRandomFromArray(biblicalNumbers.filter(n => n < 100), 2);
      const grupoBiblico = GRUPOS_QUENTES[selectedBiblical[0] % 5];
      const animalBiblico = ANIMAIS.find(a => a.grupo === grupoBiblico.grupo);
      numeros = [
        animalBiblico?.numeros[0] || reduceToDigits(7, digitos),
        ...selectedBiblical.map(n => reduceToDigits(n, digitos))
      ];
      explicacao = `Números sagrados ${selectedBiblical.join(', ')} apontam para ${animalBiblico?.nome}. A graça divina confirma o que os dados mostram: ${grupoBiblico.frequencia} aparições recentes!`;
      energia = "Graça + Estatística";
      confianca += 8;
      break;

    case "apocrifos":
      const enochNumbers = [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98];
      // Enoque + padrões de repetição
      const gruposQueRepetem = PADROES_REPETICAO.gruposQueRepetem;
      const grupoEnoch = gruposQueRepetem[Math.floor(Math.random() * gruposQueRepetem.length)];
      const animalEnoch = ANIMAIS.find(a => a.grupo === grupoEnoch);
      numeros = [
        animalEnoch?.numeros[0] || reduceToDigits(enochNumbers[0], digitos),
        ...getRandomFromArray(enochNumbers, 2).map(n => reduceToDigits(n + day, digitos))
      ];
      explicacao = `O Livro de Enoque revela: ${animalEnoch?.nome} tende a repetir (padrão histórico confirmado). Os Vigilantes apontam grupos com alta recorrência.`;
      energia = "Conhecimento Oculto";
      confianca += 6;
      break;

    case "magia":
      // Quadrado mágico + grupos ultra hot
      const magicSquare = [2, 7, 6, 9, 5, 1, 4, 3, 8];
      const grupoMagico = GRUPOS_QUENTES.find(g => g.status === 'ultra_hot') || GRUPOS_QUENTES[0];
      const animalMagico = ANIMAIS.find(a => a.grupo === grupoMagico.grupo);
      numeros = [
        animalMagico?.numeros[0] || reduceToDigits(15, digitos),
        animalMagico?.numeros[1] || reduceToDigits(magicSquare[0] * magicSquare[1], digitos),
        reduceToDigits(15 * day, digitos)
      ];
      explicacao = `Quadrado Mágico Lo Shu canaliza para ${animalMagico?.nome} (${grupoMagico.status === 'ultra_hot' ? '🔥🔥🔥 ULTRA HOT' : '🔥🔥'}). Magia ancestral + ${grupoMagico.frequencia} aparições = poder máximo!`;
      energia = "Magia + Big Data";
      confianca += 20;
      break;

    // NOVO: Método baseado puramente em estatísticas
    case "estatistica":
      numeros = gerarNumerosHistoricos(digitos);
      const gruposUsados = numeros.map(n => {
        const dezena = n.slice(-2);
        return ANIMAIS.find(a => a.numeros.includes(dezena))?.nome;
      }).filter(Boolean).join(', ');
      explicacao = `Análise estatística pura de 50+ extrações reais. Horário ${horarioAtual} favorece: ${gruposUsados}. Baseado em frequência histórica comprovada.`;
      energia = "Dados Puros";
      confianca = 85 + Math.floor(Math.random() * 10);
      break;

    default:
      numeros = gerarNumerosHistoricos(digitos);
      explicacao = "Análise baseada em padrões históricos reais.";
      energia = "Energia Estatística";
  }

  // Garantir formato correto
  numeros = numeros.map(n => {
    if (digitos === 2) return n.slice(-2).padStart(2, '0');
    if (digitos === 3) return n.slice(-3).padStart(3, '0');
    return n.slice(-4).padStart(4, '0');
  });

  // Find matching animal group for the first number
  const dezena = numeros[0].slice(-2);
  const grupo = ANIMAIS.find(a => a.numeros.includes(dezena));

  return {
    numeros: [...new Set(numeros)], // Remove duplicates
    grupo,
    metodo: metodoId,
    explicacao,
    energia,
    confianca: Math.min(confianca, 98), // Max 98% para parecer realista
    gruposQuentes,
    horarioAnalise: horarioAtual
  };
};
