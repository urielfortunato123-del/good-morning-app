// Tabela de São Cipriano - Interpretação de Sonhos para o Jogo do Bicho
// Baseado no tradicional "Livro de São Cipriano"

export interface InterpretacaoSonho {
  palavra: string;
  grupo: number;
  animal: string;
  dezenas: string[];
  significado: string;
}

// Tabela tradicional de sonhos → números
export const TABELA_SAO_CIPRIANO: InterpretacaoSonho[] = [
  // Animais
  { palavra: "avestruz", grupo: 1, animal: "Avestruz", dezenas: ["01", "02", "03", "04"], significado: "Viagem, fuga, covardia" },
  { palavra: "águia", grupo: 2, animal: "Águia", dezenas: ["05", "06", "07", "08"], significado: "Poder, visão, liberdade" },
  { palavra: "burro", grupo: 3, animal: "Burro", dezenas: ["09", "10", "11", "12"], significado: "Trabalho duro, teimosia" },
  { palavra: "borboleta", grupo: 4, animal: "Borboleta", dezenas: ["13", "14", "15", "16"], significado: "Transformação, leveza, alma" },
  { palavra: "cachorro", grupo: 5, animal: "Cachorro", dezenas: ["17", "18", "19", "20"], significado: "Amizade, lealdade, proteção" },
  { palavra: "cabra", grupo: 6, animal: "Cabra", dezenas: ["21", "22", "23", "24"], significado: "Teimosidade, força, fertilidade" },
  { palavra: "carneiro", grupo: 7, animal: "Carneiro", dezenas: ["25", "26", "27", "28"], significado: "Sacrifício, liderança, iniciativa" },
  { palavra: "camelo", grupo: 8, animal: "Camelo", dezenas: ["29", "30", "31", "32"], significado: "Resistência, paciência, viagem" },
  { palavra: "cobra", grupo: 9, animal: "Cobra", dezenas: ["33", "34", "35", "36"], significado: "Sabedoria, perigo, transformação" },
  { palavra: "coelho", grupo: 10, animal: "Coelho", dezenas: ["37", "38", "39", "40"], significado: "Fertilidade, sorte, rapidez" },
  { palavra: "cavalo", grupo: 11, animal: "Cavalo", dezenas: ["41", "42", "43", "44"], significado: "Força, liberdade, nobreza" },
  { palavra: "elefante", grupo: 12, animal: "Elefante", dezenas: ["45", "46", "47", "48"], significado: "Memória, força, sabedoria" },
  { palavra: "galo", grupo: 13, animal: "Galo", dezenas: ["49", "50", "51", "52"], significado: "Despertar, vigilância, orgulho" },
  { palavra: "gato", grupo: 14, animal: "Gato", dezenas: ["53", "54", "55", "56"], significado: "Mistério, independência, intuição" },
  { palavra: "jacaré", grupo: 15, animal: "Jacaré", dezenas: ["57", "58", "59", "60"], significado: "Perigo oculto, traição, paciência" },
  { palavra: "leão", grupo: 16, animal: "Leão", dezenas: ["61", "62", "63", "64"], significado: "Coragem, poder, realeza" },
  { palavra: "macaco", grupo: 17, animal: "Macaco", dezenas: ["65", "66", "67", "68"], significado: "Astúcia, brincadeira, imitação" },
  { palavra: "porco", grupo: 18, animal: "Porco", dezenas: ["69", "70", "71", "72"], significado: "Abundância, fartura, prosperidade" },
  { palavra: "pavão", grupo: 19, animal: "Pavão", dezenas: ["73", "74", "75", "76"], significado: "Vaidade, beleza, orgulho" },
  { palavra: "peru", grupo: 20, animal: "Peru", dezenas: ["77", "78", "79", "80"], significado: "Festa, celebração, abundância" },
  { palavra: "touro", grupo: 21, animal: "Touro", dezenas: ["81", "82", "83", "84"], significado: "Força, determinação, fertilidade" },
  { palavra: "tigre", grupo: 22, animal: "Tigre", dezenas: ["85", "86", "87", "88"], significado: "Poder, agressividade, paixão" },
  { palavra: "urso", grupo: 23, animal: "Urso", dezenas: ["89", "90", "91", "92"], significado: "Força interior, introspecção" },
  { palavra: "veado", grupo: 24, animal: "Veado", dezenas: ["93", "94", "95", "96"], significado: "Graciosidade, sensibilidade" },
  { palavra: "vaca", grupo: 25, animal: "Vaca", dezenas: ["97", "98", "99", "00"], significado: "Nutrição, abundância, maternidade" },

  // Elementos e natureza
  { palavra: "água", grupo: 9, animal: "Cobra", dezenas: ["33", "34", "35", "36"], significado: "Emoções, purificação" },
  { palavra: "fogo", grupo: 16, animal: "Leão", dezenas: ["61", "62", "63", "64"], significado: "Paixão, transformação" },
  { palavra: "terra", grupo: 12, animal: "Elefante", dezenas: ["45", "46", "47", "48"], significado: "Estabilidade, abundância" },
  { palavra: "ar", grupo: 2, animal: "Águia", dezenas: ["05", "06", "07", "08"], significado: "Liberdade, pensamentos" },
  { palavra: "sol", grupo: 16, animal: "Leão", dezenas: ["61", "62", "63", "64"], significado: "Vitalidade, sucesso" },
  { palavra: "lua", grupo: 14, animal: "Gato", dezenas: ["53", "54", "55", "56"], significado: "Mistério, feminino, intuição" },
  { palavra: "estrela", grupo: 2, animal: "Águia", dezenas: ["05", "06", "07", "08"], significado: "Esperança, guia, destino" },
  { palavra: "chuva", grupo: 9, animal: "Cobra", dezenas: ["33", "34", "35", "36"], significado: "Purificação, renovação" },
  { palavra: "rio", grupo: 15, animal: "Jacaré", dezenas: ["57", "58", "59", "60"], significado: "Fluxo da vida, jornada" },
  { palavra: "mar", grupo: 15, animal: "Jacaré", dezenas: ["57", "58", "59", "60"], significado: "Inconsciente, emoções profundas" },
  { palavra: "montanha", grupo: 12, animal: "Elefante", dezenas: ["45", "46", "47", "48"], significado: "Obstáculos, conquistas" },
  { palavra: "floresta", grupo: 17, animal: "Macaco", dezenas: ["65", "66", "67", "68"], significado: "Mistério, perigo, descoberta" },

  // Pessoas e relações
  { palavra: "mãe", grupo: 25, animal: "Vaca", dezenas: ["97", "98", "99", "00"], significado: "Nutrição, proteção, amor" },
  { palavra: "pai", grupo: 21, animal: "Touro", dezenas: ["81", "82", "83", "84"], significado: "Autoridade, proteção" },
  { palavra: "filho", grupo: 10, animal: "Coelho", dezenas: ["37", "38", "39", "40"], significado: "Esperança, futuro, alegria" },
  { palavra: "criança", grupo: 10, animal: "Coelho", dezenas: ["37", "38", "39", "40"], significado: "Inocência, novo começo" },
  { palavra: "bebê", grupo: 10, animal: "Coelho", dezenas: ["37", "38", "39", "40"], significado: "Novo projeto, inocência" },
  { palavra: "mulher", grupo: 14, animal: "Gato", dezenas: ["53", "54", "55", "56"], significado: "Feminino, intuição, mistério" },
  { palavra: "homem", grupo: 21, animal: "Touro", dezenas: ["81", "82", "83", "84"], significado: "Força, ação, determinação" },
  { palavra: "amigo", grupo: 5, animal: "Cachorro", dezenas: ["17", "18", "19", "20"], significado: "Lealdade, companheirismo" },
  { palavra: "inimigo", grupo: 9, animal: "Cobra", dezenas: ["33", "34", "35", "36"], significado: "Perigo, traição" },
  { palavra: "rei", grupo: 16, animal: "Leão", dezenas: ["61", "62", "63", "64"], significado: "Poder, autoridade, sucesso" },
  { palavra: "rainha", grupo: 16, animal: "Leão", dezenas: ["61", "62", "63", "64"], significado: "Poder feminino, nobreza" },
  { palavra: "padre", grupo: 7, animal: "Carneiro", dezenas: ["25", "26", "27", "28"], significado: "Espiritualidade, guia" },
  { palavra: "médico", grupo: 9, animal: "Cobra", dezenas: ["33", "34", "35", "36"], significado: "Cura, sabedoria, ciência" },

  // Objetos e coisas
  { palavra: "dinheiro", grupo: 18, animal: "Porco", dezenas: ["69", "70", "71", "72"], significado: "Prosperidade, ganhos" },
  { palavra: "ouro", grupo: 18, animal: "Porco", dezenas: ["69", "70", "71", "72"], significado: "Riqueza, valor, poder" },
  { palavra: "prata", grupo: 14, animal: "Gato", dezenas: ["53", "54", "55", "56"], significado: "Lua, feminino, clareza" },
  { palavra: "casa", grupo: 6, animal: "Cabra", dezenas: ["21", "22", "23", "24"], significado: "Segurança, família, lar" },
  { palavra: "carro", grupo: 11, animal: "Cavalo", dezenas: ["41", "42", "43", "44"], significado: "Viagem, movimento, status" },
  { palavra: "avião", grupo: 2, animal: "Águia", dezenas: ["05", "06", "07", "08"], significado: "Viagem, liberdade, ascensão" },
  { palavra: "barco", grupo: 15, animal: "Jacaré", dezenas: ["57", "58", "59", "60"], significado: "Viagem, emoções, jornada" },
  { palavra: "igreja", grupo: 7, animal: "Carneiro", dezenas: ["25", "26", "27", "28"], significado: "Fé, espiritualidade, paz" },
  { palavra: "cruz", grupo: 7, animal: "Carneiro", dezenas: ["25", "26", "27", "28"], significado: "Sacrifício, fé, proteção" },
  { palavra: "espada", grupo: 22, animal: "Tigre", dezenas: ["85", "86", "87", "88"], significado: "Luta, coragem, verdade" },
  { palavra: "faca", grupo: 22, animal: "Tigre", dezenas: ["85", "86", "87", "88"], significado: "Corte, separação, perigo" },
  { palavra: "arma", grupo: 22, animal: "Tigre", dezenas: ["85", "86", "87", "88"], significado: "Agressão, defesa, poder" },
  { palavra: "livro", grupo: 1, animal: "Avestruz", dezenas: ["01", "02", "03", "04"], significado: "Conhecimento, sabedoria" },
  { palavra: "carta", grupo: 4, animal: "Borboleta", dezenas: ["13", "14", "15", "16"], significado: "Notícias, mensagens" },
  { palavra: "telefone", grupo: 4, animal: "Borboleta", dezenas: ["13", "14", "15", "16"], significado: "Comunicação, notícias" },
  { palavra: "espelho", grupo: 14, animal: "Gato", dezenas: ["53", "54", "55", "56"], significado: "Reflexão, vaidade, verdade" },
  { palavra: "relógio", grupo: 13, animal: "Galo", dezenas: ["49", "50", "51", "52"], significado: "Tempo, urgência, despertar" },

  // Ações e sentimentos
  { palavra: "morte", grupo: 9, animal: "Cobra", dezenas: ["33", "34", "35", "36"], significado: "Transformação, fim de ciclo" },
  { palavra: "casamento", grupo: 24, animal: "Veado", dezenas: ["93", "94", "95", "96"], significado: "União, compromisso, amor" },
  { palavra: "nascimento", grupo: 10, animal: "Coelho", dezenas: ["37", "38", "39", "40"], significado: "Novo começo, criação" },
  { palavra: "viagem", grupo: 11, animal: "Cavalo", dezenas: ["41", "42", "43", "44"], significado: "Mudança, aventura" },
  { palavra: "queda", grupo: 1, animal: "Avestruz", dezenas: ["01", "02", "03", "04"], significado: "Perda, fracasso, medo" },
  { palavra: "voo", grupo: 2, animal: "Águia", dezenas: ["05", "06", "07", "08"], significado: "Liberdade, sucesso, elevação" },
  { palavra: "briga", grupo: 22, animal: "Tigre", dezenas: ["85", "86", "87", "88"], significado: "Conflito, tensão" },
  { palavra: "festa", grupo: 20, animal: "Peru", dezenas: ["77", "78", "79", "80"], significado: "Celebração, alegria" },
  { palavra: "choro", grupo: 9, animal: "Cobra", dezenas: ["33", "34", "35", "36"], significado: "Emoção, purificação" },
  { palavra: "riso", grupo: 17, animal: "Macaco", dezenas: ["65", "66", "67", "68"], significado: "Alegria, leveza" },
  { palavra: "medo", grupo: 9, animal: "Cobra", dezenas: ["33", "34", "35", "36"], significado: "Perigo, alerta" },
  { palavra: "amor", grupo: 24, animal: "Veado", dezenas: ["93", "94", "95", "96"], significado: "União, paixão, carinho" },
  { palavra: "sexo", grupo: 24, animal: "Veado", dezenas: ["93", "94", "95", "96"], significado: "Desejo, intimidade" },
  { palavra: "gravidez", grupo: 25, animal: "Vaca", dezenas: ["97", "98", "99", "00"], significado: "Criação, fertilidade" },

  // Cores
  { palavra: "vermelho", grupo: 22, animal: "Tigre", dezenas: ["85", "86", "87", "88"], significado: "Paixão, energia, perigo" },
  { palavra: "preto", grupo: 9, animal: "Cobra", dezenas: ["33", "34", "35", "36"], significado: "Mistério, morte, poder" },
  { palavra: "branco", grupo: 1, animal: "Avestruz", dezenas: ["01", "02", "03", "04"], significado: "Pureza, paz, início" },
  { palavra: "verde", grupo: 10, animal: "Coelho", dezenas: ["37", "38", "39", "40"], significado: "Esperança, natureza, cura" },
  { palavra: "azul", grupo: 2, animal: "Águia", dezenas: ["05", "06", "07", "08"], significado: "Paz, céu, espiritualidade" },
  { palavra: "amarelo", grupo: 16, animal: "Leão", dezenas: ["61", "62", "63", "64"], significado: "Sol, alegria, riqueza" },
  { palavra: "dourado", grupo: 18, animal: "Porco", dezenas: ["69", "70", "71", "72"], significado: "Riqueza, sucesso, divino" },

  // Números e datas
  { palavra: "três", grupo: 3, animal: "Burro", dezenas: ["09", "10", "11", "12"], significado: "Trindade, criação" },
  { palavra: "sete", grupo: 7, animal: "Carneiro", dezenas: ["25", "26", "27", "28"], significado: "Perfeição, espiritualidade" },
  { palavra: "treze", grupo: 13, animal: "Galo", dezenas: ["49", "50", "51", "52"], significado: "Transformação, azar/sorte" },

  // Lugares
  { palavra: "cemitério", grupo: 9, animal: "Cobra", dezenas: ["33", "34", "35", "36"], significado: "Fim de ciclo, memórias" },
  { palavra: "hospital", grupo: 9, animal: "Cobra", dezenas: ["33", "34", "35", "36"], significado: "Cura, doença, cuidado" },
  { palavra: "escola", grupo: 1, animal: "Avestruz", dezenas: ["01", "02", "03", "04"], significado: "Aprendizado, conhecimento" },
  { palavra: "praia", grupo: 15, animal: "Jacaré", dezenas: ["57", "58", "59", "60"], significado: "Descanso, emoções" },
  { palavra: "fazenda", grupo: 25, animal: "Vaca", dezenas: ["97", "98", "99", "00"], significado: "Trabalho, abundância" },

  // Alimentos
  { palavra: "pão", grupo: 18, animal: "Porco", dezenas: ["69", "70", "71", "72"], significado: "Sustento, abundância" },
  { palavra: "carne", grupo: 21, animal: "Touro", dezenas: ["81", "82", "83", "84"], significado: "Força, energia, desejo" },
  { palavra: "fruta", grupo: 10, animal: "Coelho", dezenas: ["37", "38", "39", "40"], significado: "Saúde, fertilidade" },
  { palavra: "vinho", grupo: 18, animal: "Porco", dezenas: ["69", "70", "71", "72"], significado: "Celebração, sangue, alegria" },
];

// Palavras-chave para busca fuzzy
export const PALAVRAS_RELACIONADAS: Record<string, string[]> = {
  "cobra": ["serpente", "víbora", "jararaca", "píton", "sucuri"],
  "cachorro": ["cão", "vira-lata", "pastor", "poodle", "pitbull"],
  "gato": ["felino", "gatinho", "bichano"],
  "cavalo": ["égua", "potro", "garanhão", "pônei"],
  "leão": ["leoa", "rei da selva", "felino grande"],
  "morte": ["morto", "falecido", "defunto", "finado", "caixão", "enterro", "funeral"],
  "água": ["rio", "mar", "lago", "piscina", "chuva", "oceano"],
  "dinheiro": ["grana", "nota", "moeda", "fortuna", "herança", "prêmio", "loteria"],
  "casa": ["lar", "residência", "apartamento", "moradia"],
  "carro": ["automóvel", "veículo", "moto", "caminhão"],
  "criança": ["menino", "menina", "bebê", "neném", "infante"],
  "mulher": ["moça", "senhora", "dama", "esposa", "namorada"],
  "homem": ["rapaz", "senhor", "marido", "namorado"],
  "sexo": ["prazer", "desejo", "paixão", "intimidade", "relação"],
  "briga": ["luta", "conflito", "discussão", "guerra", "batalha"],
  "viagem": ["viajar", "passeio", "mudança", "partida"],
};

// Função para interpretar um sonho
export const interpretarSonho = (textoSonho: string): InterpretacaoSonho[] => {
  const texto = textoSonho.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const palavras = texto.split(/\s+/);
  const resultados: InterpretacaoSonho[] = [];
  const gruposEncontrados = new Set<number>();

  // Buscar correspondências diretas
  for (const interpretacao of TABELA_SAO_CIPRIANO) {
    const palavraBase = interpretacao.palavra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    if (texto.includes(palavraBase) && !gruposEncontrados.has(interpretacao.grupo)) {
      resultados.push(interpretacao);
      gruposEncontrados.add(interpretacao.grupo);
    }
  }

  // Buscar palavras relacionadas
  for (const [palavraChave, relacionadas] of Object.entries(PALAVRAS_RELACIONADAS)) {
    for (const relacionada of relacionadas) {
      const relacionadaNorm = relacionada.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (texto.includes(relacionadaNorm)) {
        const interpretacao = TABELA_SAO_CIPRIANO.find(i => i.palavra === palavraChave);
        if (interpretacao && !gruposEncontrados.has(interpretacao.grupo)) {
          resultados.push(interpretacao);
          gruposEncontrados.add(interpretacao.grupo);
        }
      }
    }
  }

  // Ordenar por relevância (quantas vezes a palavra aparece)
  resultados.sort((a, b) => {
    const countA = (texto.match(new RegExp(a.palavra, 'gi')) || []).length;
    const countB = (texto.match(new RegExp(b.palavra, 'gi')) || []).length;
    return countB - countA;
  });

  return resultados.slice(0, 5); // Máximo 5 interpretações
};

// Gerar números baseados nas interpretações
export const gerarNumerosSaoCipriano = (interpretacoes: InterpretacaoSonho[], digitos: number): string[] => {
  if (interpretacoes.length === 0) return [];

  const numeros: string[] = [];
  
  for (const interp of interpretacoes.slice(0, 3)) {
    const dezena = interp.dezenas[Math.floor(Math.random() * interp.dezenas.length)];
    
    if (digitos === 2) {
      numeros.push(dezena);
    } else if (digitos === 3) {
      const centena = Math.floor(Math.random() * 10);
      numeros.push(`${centena}${dezena}`);
    } else {
      const milhar = Math.floor(Math.random() * 100);
      numeros.push(milhar.toString().padStart(2, '0') + dezena);
    }
  }

  return numeros;
};
