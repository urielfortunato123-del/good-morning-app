import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import MysticBackground from "@/components/MysticBackground";
import ResultCard from "@/components/ResultCard";
import CadastroResultado from "@/components/CadastroResultado";
import SaoCiprianoForm from "@/components/SaoCiprianoForm";
import { CoinAnimation } from "@/components/CoinAnimation";
import HistoricoAcertos from "@/components/HistoricoAcertos";
import PainelQuantico from "@/components/PainelQuantico";
import { generateCanalMagnetico, AnalysisResult } from "@/utils/analysisEngine";
import { useInteligenciaQuantica, AnaliseQuantica } from "@/hooks/useInteligenciaQuantica";
import { MODALIDADES } from "@/data/bichoData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Sparkles, Zap, Trophy, Brain, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const HORARIOS = [
  "09:20", "11:20", "14:20", "16:20", "18:20", "21:20"
];

const Index = () => {
  const navigate = useNavigate();
  const [modalidade, setModalidade] = useState<string | null>(null);
  const [data, setData] = useState<string>(new Date().toISOString().split('T')[0]);
  const [horario, setHorario] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analiseQuantica, setAnaliseQuantica] = useState<AnaliseQuantica | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [showCoins, setShowCoins] = useState(false);
  const [modoQuantico, setModoQuantico] = useState(false);
  
  const { analisar, loading: loadingQuantico } = useInteligenciaQuantica();

  // Check onboarding on mount
  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    if (!completed) {
      navigate("/onboarding");
    }
  }, [navigate]);

  const handleGenerate = async () => {
    if (!modalidade || !horario) return;

    const selectedModalidade = MODALIDADES.find(m => m.id === modalidade);
    const digitos = selectedModalidade?.digitos || 2;

    if (modoQuantico) {
      // Usar IA Quântica
      setLoading(true);
      const analise = await analisar(horario, modalidade, digitos);
      if (analise) {
        setAnaliseQuantica(analise);
        // Converter para formato AnalysisResult
        const analysisResult: AnalysisResult = {
          numeros: analise.numeros,
          grupo: undefined,
          metodo: "inteligencia-quantica",
          explicacao: analise.explicacao,
          energia: "🧠 INTELIGÊNCIA QUÂNTICA 🧠",
          confianca: analise.confianca,
          gruposQuentes: analise.gruposQuentes?.map(g => ({ 
            grupo: g, 
            nome: MODALIDADES.find(m => m.id === modalidade)?.nome || "Grupo " + g,
            status: "🔥🔥🔥"
          })),
          horarioAnalise: horario,
          metodosUsados: ["🧠 IA Quântica", ...analise.padroesIdentificados.slice(0, 5)],
          usouAcertosHistoricos: true
        };
        setResult(analysisResult);
        setHistory(prev => [analysisResult, ...prev.slice(0, 4)]);
      }
      setLoading(false);
      setShowCoins(true);
    } else {
      // Usar Canal Magnético tradicional
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const analysisResult = generateCanalMagnetico(digitos, horario.replace(":", "h").slice(0, 2) + "h");
      setResult(analysisResult);
      setHistory(prev => [analysisResult, ...prev.slice(0, 4)]);
      setLoading(false);
      setShowCoins(true);
    }
  };

  const canGenerate = modalidade && horario;

  return (
    <div className="min-h-screen relative">
      <CoinAnimation isActive={showCoins} onComplete={() => setShowCoins(false)} />
      <MysticBackground />
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="oraculo" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-card/50 border border-gold/10">
              <TabsTrigger value="oraculo" className="font-cinzel text-xs md:text-sm data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                🔮 Oráculo
              </TabsTrigger>
              <TabsTrigger value="quantico" className="font-cinzel text-xs md:text-sm data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                🧠 IA
              </TabsTrigger>
              <TabsTrigger value="acertos" className="font-cinzel text-xs md:text-sm data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                🏆 Acertos
              </TabsTrigger>
              <TabsTrigger value="cipriano" className="font-cinzel text-xs md:text-sm data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                📖 Cipriano
              </TabsTrigger>
              <TabsTrigger value="cadastro" className="font-cinzel text-xs md:text-sm data-[state=active]:bg-gold/20 data-[state=active]:text-gold">
                📝 Cadastrar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="oraculo">
              <div className="space-y-6">
                {/* Canal Magnético */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-900/20 via-card/50 to-green-900/20 border border-gold/30 backdrop-blur-sm space-y-6 relative overflow-hidden">
                  {/* Decoração de dinheiro */}
                  <div className="absolute top-2 right-2 text-4xl opacity-20 animate-float">💰</div>
                  <div className="absolute bottom-2 left-2 text-3xl opacity-20 animate-float" style={{ animationDelay: "0.5s" }}>💶</div>
                  <div className="absolute top-1/2 right-8 text-2xl opacity-10 animate-float" style={{ animationDelay: "1s" }}>💵</div>
                  
                  <div className="text-center mb-4 relative">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl">💰</span>
                      <h2 className="font-cinzel text-2xl bg-gradient-to-r from-yellow-400 via-gold to-yellow-500 bg-clip-text text-transparent">
                        Canal Magnético da Prosperidade
                      </h2>
                      <span className="text-2xl">💰</span>
                    </div>
                    <p className="font-cormorant text-muted-foreground">
                      ⚡ 11 métodos místicos trabalhando juntos ⚡
                    </p>
                    <div className="flex flex-wrap justify-center gap-1 mt-2 text-xs text-gold/60">
                      <span>📊 Estatística</span>•<span>🌀 Fibonacci</span>•<span>⚡ Tesla</span>•
                      <span>🔢 Numerologia</span>•<span>♈ Astrologia</span>•<span>🌙 Lunar</span>•
                      <span>⚛️ Quântica</span>•<span>🧲 Atração</span>•<span>✡️ Kabbalah</span>•
                      <span>📖 Bíblia</span>•<span>✨ Magia</span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Modalidade */}
                    <div className="space-y-2">
                      <label className="font-cinzel text-sm text-foreground flex items-center gap-2">
                        <span className="text-gold">🎯</span> Tipo de Jogo
                      </label>
                      <Select value={modalidade || ""} onValueChange={setModalidade}>
                        <SelectTrigger className="bg-background/50 border-gold/30 font-cormorant hover:border-gold/50 transition-colors">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {MODALIDADES.map((mod) => (
                            <SelectItem key={mod.id} value={mod.id} className="font-cormorant">
                              {mod.nome} ({mod.multiplicador})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Data */}
                    <div className="space-y-2">
                      <label className="font-cinzel text-sm text-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold" /> Data
                      </label>
                      <input
                        type="date"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-background/50 border border-gold/30 font-cormorant text-foreground focus:border-gold/60 focus:outline-none hover:border-gold/50 transition-colors"
                      />
                    </div>

                    {/* Horário */}
                    <div className="space-y-2">
                      <label className="font-cinzel text-sm text-foreground flex items-center gap-2">
                        <span className="text-gold">🕐</span> Horário
                      </label>
                      <Select value={horario || ""} onValueChange={setHorario}>
                        <SelectTrigger className="bg-background/50 border-gold/30 font-cormorant hover:border-gold/50 transition-colors">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {HORARIOS.map((h) => (
                            <SelectItem key={h} value={h} className="font-cormorant">
                              {h}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Botão Magnético */}
                  <button
                    onClick={handleGenerate}
                    disabled={!canGenerate || loading}
                    className={`
                      w-full py-4 px-6 rounded-xl font-cinzel text-lg uppercase tracking-wider
                      transition-all duration-300 relative overflow-hidden
                      ${canGenerate && !loading 
                        ? "bg-gradient-to-r from-yellow-600 via-gold to-yellow-500 text-black shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:shadow-[0_0_50px_rgba(234,179,8,0.6)] hover:scale-[1.02]" 
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                      }
                    `}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 animate-spin" />
                        Canalizando Energias...
                        <Sparkles className="w-5 h-5 animate-spin" />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Zap className="w-5 h-5" />
                        💰 Ativar Canal Magnético 💰
                        <Zap className="w-5 h-5" />
                      </span>
                    )}
                  </button>
                </div>

                {/* Resultado */}
                {result ? (
                  <ResultCard result={result} modalidade={modalidade || ''} data={data} horario={horario || ''} />
                ) : (
                  <div className="flex items-center justify-center p-8 rounded-2xl border border-dashed border-gold/20 bg-card/30">
                    <div className="text-center">
                      <div className="text-6xl mb-4 opacity-50 animate-float">🔮</div>
                      <h3 className="font-cinzel text-xl text-gold/70 mb-2">
                        Aguardando Consulta
                      </h3>
                      <p className="font-cormorant text-muted-foreground italic">
                        Preencha os campos acima e clique em gerar
                      </p>
                    </div>
                  </div>
                )}

                {/* Histórico */}
                {history.length > 1 && (
                  <div className="p-4 rounded-xl bg-card/30 border border-gold/10">
                    <h3 className="font-cinzel text-sm text-muted-foreground uppercase tracking-widest mb-3">
                      Revelações Anteriores
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {history.slice(1).map((item, index) => (
                        <div 
                          key={index}
                          className="px-3 py-2 rounded-lg bg-muted/50 border border-gold/10"
                        >
                          <span className="font-cinzel text-sm text-gold">
                            {item.numeros.join(" • ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aviso */}
                <div className="p-4 rounded-xl bg-mystic-purple/10 border border-mystic-purple/20">
                  <p className="text-xs text-muted-foreground text-center font-cormorant">
                    ⚠️ Este aplicativo é apenas para entretenimento. Jogue com responsabilidade.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quantico">
              <PainelQuantico />
            </TabsContent>

            <TabsContent value="acertos">
              <div className="p-6 rounded-2xl bg-card/50 border border-gold/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-gold" />
                  <h2 className="font-cinzel text-xl text-gold">Histórico de Acertos</h2>
                </div>
                <p className="font-cormorant text-muted-foreground text-sm mb-4">
                  Seus números vencedores ficam salvos aqui e ajudam a melhorar as análises futuras!
                </p>
                <HistoricoAcertos />
              </div>
            </TabsContent>

            <TabsContent value="cipriano">
              <SaoCiprianoForm />
            </TabsContent>

            <TabsContent value="cadastro">
              <div className="max-w-2xl mx-auto">
                <CadastroResultado />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t border-gold/10 mt-16 py-6">
        <div className="container mx-auto px-4 text-center space-y-3">
          <p className="font-cormorant text-sm text-muted-foreground">
            ✧ Oráculo do Bicho — Sabedoria Mística & Análise Esotérica ✧
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              localStorage.removeItem("onboarding_completed");
              navigate("/onboarding");
            }}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            <HelpCircle className="w-3 h-3 mr-1" />
            Ver tutorial novamente
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Index;
