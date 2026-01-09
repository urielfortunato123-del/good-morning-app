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

export const MODALIDADES = [
  { id: "milhar", nome: "Milhar", multiplicador: "9000x", digitos: 4 },
  { id: "milhar-centena", nome: "Milhar Centena", multiplicador: "9000x", digitos: 4 },
  { id: "centena", nome: "Centena", multiplicador: "900x", digitos: 3 },
  { id: "dezena", nome: "Dezena", multiplicador: "90x", digitos: 2 },
  { id: "grupo", nome: "Grupo", multiplicador: "23x", digitos: 2 },
  { id: "duque-dezena", nome: "Duque Dezena", multiplicador: "300x", digitos: 2 },
  { id: "terno-dezena", nome: "Terno de Dezena", multiplicador: "13000x", digitos: 2 },
  { id: "terno-grupo", nome: "Terno de Grupo", multiplicador: "250x", digitos: 2 },
  { id: "duque-grupo", nome: "Duque de Grupo", multiplicador: "20x", digitos: 2 },
  { id: "palpito", nome: "Palpitão", multiplicador: "800x", digitos: 4 },
];

export const METODOS_ANALISE = [
  {
    id: "fibonacci",
    nome: "Fibonacci",
    icone: "🌀",
    descricao: "Sequência áurea da natureza",
    categoria: "matematica"
  },
  {
    id: "tesla",
    nome: "Tesla 369",
    icone: "⚡",
    descricao: "Os números da energia universal",
    categoria: "matematica"
  },
  {
    id: "numerologia",
    nome: "Numerologia",
    icone: "🔢",
    descricao: "Vibrações numéricas pessoais",
    categoria: "esoterica"
  },
  {
    id: "kabbalah",
    nome: "Kabbalah",
    icone: "✡️",
    descricao: "Sabedoria mística judaica",
    categoria: "esoterica"
  },
  {
    id: "astrologia",
    nome: "Astrologia",
    icone: "♈",
    descricao: "Influência dos astros",
    categoria: "astral"
  },
  {
    id: "cosmico",
    nome: "Cósmico Astral",
    icone: "🌌",
    descricao: "Alinhamento planetário",
    categoria: "astral"
  },
  {
    id: "quantica",
    nome: "Quântica",
    icone: "⚛️",
    descricao: "Probabilidades quânticas",
    categoria: "cientifica"
  },
  {
    id: "lei-atracao",
    nome: "Lei da Atração",
    icone: "🧲",
    descricao: "Manifestação de abundância",
    categoria: "metafisica"
  },
  {
    id: "lei-suposicao",
    nome: "Lei da Suposição",
    icone: "💭",
    descricao: "Poder da imaginação criadora",
    categoria: "metafisica"
  },
  {
    id: "biblia",
    nome: "Bíblia Sagrada",
    icone: "📖",
    descricao: "Números bíblicos sagrados",
    categoria: "religiosa"
  },
  {
    id: "apocrifos",
    nome: "Livros Apócrifos",
    icone: "📜",
    descricao: "Conhecimento oculto ancestral",
    categoria: "religiosa"
  },
  {
    id: "magia",
    nome: "Magia da Prosperidade",
    icone: "✨",
    descricao: "Rituais de abundância",
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
