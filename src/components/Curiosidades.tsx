import { Book, Calendar, MapPin, Sparkles, Info, Trophy, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Curiosidades = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-cinzel text-2xl bg-gradient-to-r from-amber-400 via-gold to-amber-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <Book className="w-6 h-6 text-gold" />
          História & Curiosidades
        </h2>
        <p className="font-cormorant text-muted-foreground mt-2">
          Descubra a fascinante história do Jogo do Bicho
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Origem */}
        <Card className="bg-gradient-to-br from-amber-900/20 via-card/50 to-yellow-900/20 border-gold/20">
          <CardHeader className="pb-2">
            <CardTitle className="font-cinzel text-lg text-gold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              A Origem (1892)
            </CardTitle>
          </CardHeader>
          <CardContent className="font-cormorant text-sm text-muted-foreground space-y-2">
            <p>
              O Jogo do Bicho foi criado em <span className="text-gold font-semibold">3 de julho de 1892</span> por{" "}
              <span className="text-gold">João Batista Viana Drummond</span>, o Barão de Drummond, proprietário do{" "}
              <span className="text-gold">Jardim Zoológico de Vila Isabel</span> no Rio de Janeiro.
            </p>
            <p>
              Para atrair visitantes ao zoológico, Drummond criou um sorteio diário onde cada visitante recebia um bilhete 
              com a imagem de um dos 25 animais do parque.
            </p>
            <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-gold/10 border border-gold/20">
              <Trophy className="w-4 h-4 text-gold" />
              <span className="text-gold text-xs">Primeiro animal sorteado: <strong>Avestruz</strong></span>
            </div>
          </CardContent>
        </Card>

        {/* Localização */}
        <Card className="bg-gradient-to-br from-emerald-900/20 via-card/50 to-teal-900/20 border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="font-cinzel text-lg text-emerald-400 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Do Zoológico para as Ruas
            </CardTitle>
          </CardHeader>
          <CardContent className="font-cormorant text-sm text-muted-foreground space-y-2">
            <p>
              O sucesso foi tão grande que logo o jogo escapou dos limites do zoológico. Comerciantes e ambulantes 
              começaram a vender bilhetes por toda a cidade do Rio de Janeiro.
            </p>
            <p>
              Em <span className="text-emerald-400 font-semibold">1895</span>, o jogo foi proibido pela primeira vez, 
              mas nunca desapareceu. Desde então, funciona na informalidade.
            </p>
            <p className="text-xs italic">
              A <span className="text-emerald-400">Paraíba</span> é o único estado onde o jogo foi regulamentado (desde 1967).
            </p>
          </CardContent>
        </Card>

        {/* Origem da Zebra */}
        <Card className="bg-gradient-to-br from-purple-900/20 via-card/50 to-pink-900/20 border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="font-cinzel text-lg text-purple-400 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Por que "Zebra" é Surpresa?
            </CardTitle>
          </CardHeader>
          <CardContent className="font-cormorant text-sm text-muted-foreground space-y-2">
            <p>
              O termo <span className="text-purple-400 font-semibold">"zebra"</span> usado no esporte para indicar 
              um resultado inesperado tem origem no Jogo do Bicho!
            </p>
            <p>
              Como <span className="text-purple-400 font-semibold">não existe zebra</span> entre os 25 animais do jogo, 
              apostar na zebra seria impossível — daí a associação com algo improvável ou surpreendente.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">🦓 Não existe no jogo</span>
              <span className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">⚽ Usado no futebol</span>
            </div>
          </CardContent>
        </Card>

        {/* Número 24 */}
        <Card className="bg-gradient-to-br from-cyan-900/20 via-card/50 to-blue-900/20 border-cyan-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="font-cinzel text-lg text-cyan-400 flex items-center gap-2">
              <Info className="w-5 h-5" />
              O Número 24 e o Veado
            </CardTitle>
          </CardHeader>
          <CardContent className="font-cormorant text-sm text-muted-foreground space-y-2">
            <p>
              O grupo <span className="text-cyan-400 font-semibold">24</span> corresponde ao <span className="text-cyan-400">Veado</span>{" "}
              (dezenas 93-96).
            </p>
            <p>
              Por muito tempo, a palavra "veado" foi usada de forma pejorativa. Isso fez com que o número 24 
              ganhasse uma associação cultural com a <span className="text-cyan-400">comunidade LGBT</span>.
            </p>
            <p>
              Hoje, muitos ressignificaram essa associação de forma positiva e orgulhosa.
            </p>
          </CardContent>
        </Card>

        {/* Economia */}
        <Card className="bg-gradient-to-br from-yellow-900/20 via-card/50 to-orange-900/20 border-yellow-500/20 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="font-cinzel text-lg text-yellow-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Curiosidades Extras
            </CardTitle>
          </CardHeader>
          <CardContent className="font-cormorant text-sm text-muted-foreground">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-yellow-400 font-semibold mb-1">💰 Movimentação</p>
                <p className="text-xs">
                  Estima-se que o jogo movimente <strong>12 bilhões de reais</strong> por ano no Brasil.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-yellow-400 font-semibold mb-1">🎪 Escolas de Samba</p>
                <p className="text-xs">
                  Historicamente, bicheiros financiaram diversas escolas de samba do Rio de Janeiro.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-yellow-400 font-semibold mb-1">📜 "Vale o Escrito"</p>
                <p className="text-xs">
                  A expressão significa que a palavra dada vale como contrato — tradição de honra no jogo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Os 25 Animais */}
      <Card className="bg-gradient-to-br from-gold/5 via-card/50 to-gold/10 border-gold/20">
        <CardHeader className="pb-2">
          <CardTitle className="font-cinzel text-lg text-gold flex items-center gap-2">
            🦁 Os 25 Animais Oficiais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2 text-center font-cormorant text-xs">
            {[
              { n: 1, a: "🦩 Avestruz" },
              { n: 2, a: "🦅 Águia" },
              { n: 3, a: "🫏 Burro" },
              { n: 4, a: "🦋 Borboleta" },
              { n: 5, a: "🐕 Cachorro" },
              { n: 6, a: "🐐 Cabra" },
              { n: 7, a: "🐏 Carneiro" },
              { n: 8, a: "🐫 Camelo" },
              { n: 9, a: "🐍 Cobra" },
              { n: 10, a: "🐇 Coelho" },
              { n: 11, a: "🐎 Cavalo" },
              { n: 12, a: "🐘 Elefante" },
              { n: 13, a: "🐓 Galo" },
              { n: 14, a: "🐱 Gato" },
              { n: 15, a: "🐊 Jacaré" },
              { n: 16, a: "🦁 Leão" },
              { n: 17, a: "🐒 Macaco" },
              { n: 18, a: "🐷 Porco" },
              { n: 19, a: "🦚 Pavão" },
              { n: 20, a: "🦃 Peru" },
              { n: 21, a: "🐂 Touro" },
              { n: 22, a: "🐅 Tigre" },
              { n: 23, a: "🐻 Urso" },
              { n: 24, a: "🦌 Veado" },
              { n: 25, a: "🐄 Vaca" },
            ].map((item) => (
              <div
                key={item.n}
                className="p-2 rounded-lg bg-gold/5 border border-gold/10 hover:border-gold/30 transition-colors"
              >
                <div className="text-gold font-semibold">{item.n}</div>
                <div className="text-muted-foreground text-[10px]">{item.a}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Aviso */}
      <p className="text-xs text-muted-foreground text-center font-cormorant italic">
        Fonte: Wikipedia — Jogo do Bicho
      </p>
    </div>
  );
};

export default Curiosidades;
