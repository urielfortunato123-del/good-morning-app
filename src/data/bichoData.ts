// Emojis para cada animal
export const ANIMAIS_EMOJI: Record<number, string> = {
  1: "🦢", 2: "🦅", 3: "🫏", 4: "🦋", 5: "🐕", 6: "🐐", 7: "🐏", 8: "🐫",
  9: "🐍", 10: "🐇", 11: "🐴", 12: "🐘", 13: "🐓", 14: "🐱", 15: "🐊",
  16: "🦁", 17: "🐒", 18: "🐷", 19: "🦚", 20: "🦃", 21: "🐂", 22: "🐅",
  23: "🐻", 24: "🦌", 25: "🐄"
};

export const ANIMAIS = [
  { grupo: 1, nome: "Avestruz", numeros: ["01", "02", "03", "04"] },
  { grupo: 2, nome: "Águia", numeros: ["05", "06", "07", "08"] },
  { grupo: 3, nome: "Burro", numeros: ["09", "10", "11", "12"] },
  { grupo: 4, nome: "Borboleta", numeros: ["13", "14", "15", "16"] },
  { grupo: 5, nome: "Cachorro", numeros: ["17", "18", "19", "20"] },
  { grupo: 6, nome: "Cabra", numeros: ["21", "22", "23", "24"] },
  { grupo: 7, nome: "Carneiro", numeros: ["25", "26", "27", "28"] },
  { grupo: 8, nome: "Camelo", numeros: ["29", "30", "31", "32"] },
  { grupo: 9, nome: "Cobra", numeros: ["33", "34", "35", "36"] },
  { grupo: 10, nome: "Coelho", numeros: ["37", "38", "39", "40"] },
  { grupo: 11, nome: "Cavalo", numeros: ["41", "42", "43", "44"] },
  { grupo: 12, nome: "Elefante", numeros: ["45", "46", "47", "48"] },
  { grupo: 13, nome: "Galo", numeros: ["49", "50", "51", "52"] },
  { grupo: 14, nome: "Gato", numeros: ["53", "54", "55", "56"] },
  { grupo: 15, nome: "Jacaré", numeros: ["57", "58", "59", "60"] },
  { grupo: 16, nome: "Leão", numeros: ["61", "62", "63", "64"] },
  { grupo: 17, nome: "Macaco", numeros: ["65", "66", "67", "68"] },
  { grupo: 18, nome: "Porco", numeros: ["69", "70", "71", "72"] },
  { grupo: 19, nome: "Pavão", numeros: ["73", "74", "75", "76"] },
  { grupo: 20, nome: "Peru", numeros: ["77", "78", "79", "80"] },
  { grupo: 21, nome: "Touro", numeros: ["81", "82", "83", "84"] },
  { grupo: 22, nome: "Tigre", numeros: ["85", "86", "87", "88"] },
  { grupo: 23, nome: "Urso", numeros: ["89", "90", "91", "92"] },
  { grupo: 24, nome: "Veado", numeros: ["93", "94", "95", "96"] },
  { grupo: 25, nome: "Vaca", numeros: ["97", "98", "99", "00"] },
];

// Multiplicadores REAIS do jogo do bicho
export const MODALIDADES = [
  { id: "milhar", nome: "Milhar", multiplicador: "4000x", digitos: 4, descricao: "Acertar os 4 dígitos no 1º prêmio" },
  { id: "milhar-centena", nome: "Milhar Centena", multiplicador: "4000x", digitos: 4, descricao: "Milhar em qualquer posição" },
  { id: "centena", nome: "Centena", multiplicador: "600x", digitos: 3, descricao: "Acertar os 3 últimos dígitos" },
  { id: "dezena", nome: "Dezena", multiplicador: "60x", digitos: 2, descricao: "Acertar os 2 últimos dígitos" },
  { id: "grupo", nome: "Grupo", multiplicador: "18x", digitos: 2, descricao: "Acertar o animal/grupo" },
  { id: "duque-dezena", nome: "Duque Dezena", multiplicador: "300x", digitos: 2, descricao: "2 dezenas em 5 prêmios" },
  { id: "terno-dezena", nome: "Terno de Dezena", multiplicador: "3000x", digitos: 2, descricao: "3 dezenas em 5 prêmios" },
  { id: "terno-grupo", nome: "Terno de Grupo", multiplicador: "130x", digitos: 2, descricao: "3 grupos em 5 prêmios" },
  { id: "duque-grupo", nome: "Duque de Grupo", multiplicador: "18.5x", digitos: 2, descricao: "2 grupos em 5 prêmios" },
  { id: "palpitao", nome: "Palpitão", multiplicador: "800x", digitos: 4, descricao: "Milhar cercada" },
];

// Tabela tradicional de sonhos → animais (baseada no Livro de São Cipriano)
// Chaves duplicadas removidas - cada palavra aponta para um ou mais grupos
export const SONHOS_ANIMAIS: Record<string, number[]> = {
  // Grupo 1 - Avestruz
  "aliança": [1], "mesa": [1], "pérola": [1], "anel": [1], "noiva": [1], "noivo": [1],
  // Grupo 2 - Águia
  "briga": [2], "palhaço": [2], "uva": [2], "voo": [2], "altura": [2], "circo": [2],
  // Grupo 3 - Burro
  "abrigo": [3], "proteção": [3], "livro": [3], "estudo": [3], "escola": [3], "biblioteca": [3],
  // Grupo 4 - Borboleta
  "criança": [4], "crianças": [4], "jardim": [4], "lua": [4], "montanha": [4], "flores": [4, 20],
  // Grupo 5 - Cachorro
  "bruxa": [5], "deus": [5], "raio": [5], "sombra": [5], "trovão": [5], "tempestade": [5], "feitiço": [5],
  // Grupo 6 - Cabra
  "escuridão": [6], "bebê": [6], "sol": [6], "recém-nascido": [6], "parto": [6, 24],
  // Grupo 7 - Carneiro
  "janela": [7], "lâmpada": [7], "moeda": [7], "ovo": [7], "ouro": [7],
  // Grupo 8 - Camelo
  "amigo": [8], "escada": [8], "homem": [8], "lápis": [8], "pirâmide": [8], "deserto": [8], "viagem": [8],
  // Grupo 9 - Cobra
  "igreja": [9], "mar": [9], "noite": [9], "ponte": [9], "seios": [9], "veneno": [9],
  // Grupo 10 - Coelho
  "beijo": [10], "pedra": [10], "amor": [10], "namorado": [10], "namorada": [10], "paixão": [10],
  // Grupo 11 - Cavalo
  "nudez": [11], "sapato": [11], "corrida": [11], "velocidade": [11], "nu": [11], "nua": [11],
  // Grupo 12 - Elefante
  "anjo": [12], "sangue": [12], "força": [12], "grande": [12], "gigante": [12], "memória": [12],
  // Grupo 13 - Galo
  "cafuné": [13], "defunto": [13], "morte": [13], "faca": [13], "muro": [13], "óculos": [13], "enterro": [13],
  // Grupo 14 - Gato
  "medo": [14], "nuvem": [14], "sal": [14], "vermelho": [14], "susto": [14], "grito": [14], "aranha": [14],
  // Grupo 15 - Jacaré
  "ilha": [15], "umbigo": [15], "água": [15], "pantano": [15], "lagoa": [15],
  // Grupo 16 - Leão
  "acidente": [16], "máscara": [16], "pé": [16], "coroa": [16], "poder": [16],
  // Grupo 17 - Macaco
  "pedra preciosa": [17], "jóia": [17], "diamante": [17], "roubo": [17], "ladrão": [17], "banana": [17],
  // Grupo 18 - Porco
  "casamento": [18, 1], "lago": [18], "mãe": [18], "lama": [18], "comida": [18], "festa": [18],
  // Grupo 19 - Pavão
  "casa": [19], "fogo": [19], "ninho": [19], "pão": [19], "rio": [19, 15], "beleza": [19], "vaidade": [19],
  // Grupo 20 - Peru
  "dinheiro": [20, 7], "flor": [20, 4], "neve": [20], "olhos": [20], "remédio": [20], "farmácia": [20],
  // Grupo 21 - Touro
  "carnaval": [21], "filhos": [21], "relógio": [21], "tempo": [21], "hora": [21],
  // Grupo 22 - Tigre
  "fantasma": [22], "navio": [22], "orelha": [22], "praia": [22], "rei": [22, 16], "barco": [22],
  // Grupo 23 - Urso
  "adultério": [23], "naufrágio": [23], "pai": [23], "queda": [23], "vulcão": [23], "cair": [23], "traição": [23, 9],
  // Grupo 24 - Veado
  "exército": [24], "hospital": [24], "nascimento": [24], "quartel": [24], "soldado": [24], "médico": [24],
  // Grupo 25 - Vaca
  "espelho": [25], "estrela": [25], "onda": [25], "quadro": [25], "leite": [25, 11], "fazenda": [25, 21],
};

export const METODOS_ANALISE = [
  {
    id: "sao-cipriano",
    nome: "📖 São Cipriano",
    icone: "📖",
    descricao: "Interprete seu sonho",
    categoria: "tradicional"
  },
  {
    id: "estatistica",
    nome: "📊 Estatística Pura",
    icone: "📊",
    descricao: "Baseado em 50+ extrações reais",
    categoria: "dados"
  },
  {
    id: "fibonacci",
    nome: "Fibonacci",
    icone: "🌀",
    descricao: "Sequência áurea + dados históricos",
    categoria: "matematica"
  },
  {
    id: "tesla",
    nome: "Tesla 369",
    icone: "⚡",
    descricao: "Energia universal + frequências",
    categoria: "matematica"
  },
  {
    id: "tesla",
    nome: "Tesla 369",
    icone: "⚡",
    descricao: "Energia universal + frequências",
    categoria: "matematica"
  },
  {
    id: "numerologia",
    nome: "Numerologia",
    icone: "🔢",
    descricao: "Vibrações + padrões estatísticos",
    categoria: "esoterica"
  },
  {
    id: "kabbalah",
    nome: "Kabbalah",
    icone: "✡️",
    descricao: "Sabedoria mística + dados",
    categoria: "esoterica"
  },
  {
    id: "astrologia",
    nome: "Astrologia",
    icone: "♈",
    descricao: "Astros + tendências do dia",
    categoria: "astral"
  },
  {
    id: "cosmico",
    nome: "Cósmico Astral",
    icone: "🌌",
    descricao: "Fase lunar + grupos quentes",
    categoria: "astral"
  },
  {
    id: "quantica",
    nome: "Quântica",
    icone: "⚛️",
    descricao: "Probabilidades + Big Data",
    categoria: "cientifica"
  },
  {
    id: "lei-atracao",
    nome: "Lei da Atração",
    icone: "🧲",
    descricao: "Abundância + estatísticas",
    categoria: "metafisica"
  },
  {
    id: "lei-suposicao",
    nome: "Lei da Suposição",
    icone: "💭",
    descricao: "Imaginação + frequência por horário",
    categoria: "metafisica"
  },
  {
    id: "biblia",
    nome: "Bíblia Sagrada",
    icone: "📖",
    descricao: "Números sagrados + padrões",
    categoria: "religiosa"
  },
  {
    id: "apocrifos",
    nome: "Livros Apócrifos",
    icone: "📜",
    descricao: "Enoque + grupos repetitivos",
    categoria: "religiosa"
  },
  {
    id: "magia",
    nome: "Magia da Prosperidade",
    icone: "✨",
    descricao: "Lo Shu + grupos ultra hot",
    categoria: "ocultismo"
  },
];

export const SIGNOS = [
  { nome: "Áries", simbolo: "♈", elemento: "Fogo", numeros: [1, 9, 17, 25] },
  { nome: "Touro", simbolo: "♉", elemento: "Terra", numeros: [2, 6, 14, 21] },
  { nome: "Gêmeos", simbolo: "♊", elemento: "Ar", numeros: [3, 5, 12, 23] },
  { nome: "Câncer", simbolo: "♋", elemento: "Água", numeros: [4, 7, 16, 22] },
  { nome: "Leão", simbolo: "♌", elemento: "Fogo", numeros: [1, 8, 16, 19] },
  { nome: "Virgem", simbolo: "♍", elemento: "Terra", numeros: [5, 14, 23, 32] },
  { nome: "Libra", simbolo: "♎", elemento: "Ar", numeros: [6, 15, 24, 33] },
  { nome: "Escorpião", simbolo: "♏", elemento: "Água", numeros: [9, 18, 27, 36] },
  { nome: "Sagitário", simbolo: "♐", elemento: "Fogo", numeros: [3, 12, 21, 30] },
  { nome: "Capricórnio", simbolo: "♑", elemento: "Terra", numeros: [8, 17, 26, 35] },
  { nome: "Aquário", simbolo: "♒", elemento: "Ar", numeros: [4, 13, 22, 31] },
  { nome: "Peixes", simbolo: "♓", elemento: "Água", numeros: [7, 16, 25, 34] },
];
