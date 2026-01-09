import { ANIMAIS, SIGNOS } from "@/data/bichoData";

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

export interface AnalysisResult {
  numeros: string[];
  grupo?: typeof ANIMAIS[0];
  metodo: string;
  explicacao: string;
  energia: string;
  confianca: number;
}

export const generateAnalysis = (metodoId: string, digitos: number): AnalysisResult => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  let numeros: string[] = [];
  let explicacao = "";
  let energia = "";
  let confianca = Math.floor(Math.random() * 30) + 70;

  switch (metodoId) {
    case "fibonacci":
      const fibIndices = getRandomFromArray(fibonacci, 3);
      numeros = fibIndices.map(n => reduceToDigits(n * day + month, digitos));
      explicacao = `A sequência de Fibonacci revela padrões ocultos na natureza. Combinando os números áureos ${fibIndices.join(', ')} com a data atual, encontramos vibrações harmônicas.`;
      energia = "Harmonia Natural";
      break;

    case "tesla":
      const teslaBase = tesla369.filter(n => n <= 99);
      const selectedTesla = getRandomFromArray(teslaBase, 3);
      numeros = selectedTesla.map(n => reduceToDigits(n + hour, digitos));
      explicacao = `Tesla dizia: "Se você soubesse a magnificência dos números 3, 6 e 9, teria a chave do universo." Os múltiplos ${selectedTesla.join(', ')} ressoam com a hora atual.`;
      energia = "Energia Universal";
      break;

    case "numerologia":
      const lifeNumber = sumDigits(day + month + sumDigits(year));
      const personalYear = sumDigits(day + month + sumDigits(2024));
      numeros = [
        reduceToDigits(lifeNumber * 11, digitos),
        reduceToDigits(personalYear * 7, digitos),
        reduceToDigits((lifeNumber + personalYear) * 9, digitos)
      ];
      explicacao = `Seu número de vida é ${lifeNumber} e seu ano pessoal é ${personalYear}. A vibração numerológica indica forte influência do número mestre 11.`;
      energia = "Vibração Pessoal";
      confianca += 5;
      break;

    case "kabbalah":
      const selectedKabba = getRandomFromArray(kabbalisticNumbers, 3);
      const sephiroth = selectedKabba.map(n => n * (day % 10 + 1));
      numeros = sephiroth.map(n => reduceToDigits(n, digitos));
      explicacao = `As Sephiroth da Árvore da Vida (${selectedKabba.join(', ')}) transmitem suas energias. O caminho místico revela números de poder através dos portais cabalísticos.`;
      energia = "Sabedoria Ancestral";
      break;

    case "astrologia":
      const currentSignIndex = (month - 1) % 12;
      const currentSign = SIGNOS[currentSignIndex];
      numeros = currentSign.numeros.slice(0, 3).map(n => reduceToDigits(n + day, digitos));
      explicacao = `O Sol transita por ${currentSign.nome} (${currentSign.simbolo}), elemento ${currentSign.elemento}. Os números regentes ${currentSign.numeros.join(', ')} estão em alta vibração.`;
      energia = `Elemento ${currentSign.elemento}`;
      break;

    case "cosmico":
      const moonNum = getMoonPhaseNumber();
      const astralNum = getCurrentAstralInfluence();
      numeros = [
        reduceToDigits(moonNum, digitos),
        reduceToDigits(astralNum, digitos),
        reduceToDigits(moonNum + astralNum, digitos)
      ];
      explicacao = `A fase lunar atual (${moonNum}%) e o alinhamento cósmico (${astralNum}) criam um portal de manifestação. Mercúrio está em aspecto favorável.`;
      energia = "Portal Cósmico";
      confianca += 10;
      break;

    case "quantica":
      const quantumSeed = Date.now() % 10000;
      const superposition = [
        (quantumSeed * 3) % 100,
        (quantumSeed * 7) % 100,
        (quantumSeed * 11) % 100
      ];
      numeros = superposition.map(n => reduceToDigits(n, digitos));
      explicacao = `No campo quântico, todas as possibilidades existem simultaneamente. O colapso da função de onda revelou estas probabilidades com alta coerência.`;
      energia = "Campo Quântico";
      break;

    case "lei-atracao":
      const intentionNum = sumDigits(day * month * hour);
      numeros = [
        reduceToDigits(intentionNum * 8, digitos),
        reduceToDigits(intentionNum * 88, digitos),
        reduceToDigits(intentionNum * 888, digitos)
      ];
      explicacao = `O número 8 é o símbolo da abundância infinita. Sua intenção manifestadora, combinada com a energia do momento, atrai estes números de prosperidade.`;
      energia = "Abundância";
      break;

    case "lei-suposicao":
      const imaginedNum = (hour * 60 + minute) % 100;
      numeros = [
        reduceToDigits(imaginedNum, digitos),
        reduceToDigits(imaginedNum + 11, digitos),
        reduceToDigits(imaginedNum + 22, digitos)
      ];
      explicacao = `Neville Goddard ensinou: "Assuma o sentimento do desejo realizado." Os números mestres 11 e 22 amplificam sua suposição criadora.`;
      energia = "Imaginação Criadora";
      break;

    case "biblia":
      const selectedBiblical = getRandomFromArray(biblicalNumbers, 3);
      numeros = selectedBiblical.map(n => reduceToDigits(n, digitos));
      explicacao = `Os números sagrados aparecem 7 vezes na Bíblia com significado especial. O 777 representa perfeição divina, enquanto o 12 simboliza completude.`;
      energia = "Graça Divina";
      break;

    case "apocrifos":
      const enochNumbers = [7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98];
      const selectedEnoch = getRandomFromArray(enochNumbers, 3);
      numeros = selectedEnoch.map(n => reduceToDigits(n + day, digitos));
      explicacao = `O Livro de Enoque revela os mistérios dos Vigilantes. Os múltiplos de 7 carregam conhecimento oculto transmitido pelos anjos caídos.`;
      energia = "Conhecimento Oculto";
      break;

    case "magia":
      const magicSquare = [2, 7, 6, 9, 5, 1, 4, 3, 8]; // Lo Shu magic square
      const selectedMagic = getRandomFromArray(magicSquare, 3);
      const sumMagic = selectedMagic.reduce((a, b) => a + b, 0);
      numeros = [
        reduceToDigits(sumMagic * day, digitos),
        reduceToDigits(selectedMagic[0] * selectedMagic[1], digitos),
        reduceToDigits(selectedMagic[1] * selectedMagic[2], digitos)
      ];
      explicacao = `O Quadrado Mágico Lo Shu (${selectedMagic.join(', ')}) é usado em rituais de prosperidade há milênios. A soma 15 representa equilíbrio e fortuna.`;
      energia = "Magia Ancestral";
      confianca += 8;
      break;

    default:
      numeros = [
        reduceToDigits(day * month, digitos),
        reduceToDigits(hour * minute || 1, digitos),
        reduceToDigits(day + month + hour, digitos)
      ];
      explicacao = "Análise baseada em padrões temporais.";
      energia = "Energia Neutra";
  }

  // Find matching animal group for the first number
  const dezena = parseInt(numeros[0].slice(-2));
  const grupo = ANIMAIS.find(a => a.numeros.includes(padNumber(dezena, 2)));

  return {
    numeros: [...new Set(numeros)], // Remove duplicates
    grupo,
    metodo: metodoId,
    explicacao,
    energia,
    confianca: Math.min(confianca, 100)
  };
};
