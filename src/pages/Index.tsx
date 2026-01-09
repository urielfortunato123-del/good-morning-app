import { useState } from "react";
import Header from "@/components/Header";
import MysticBackground from "@/components/MysticBackground";
import ModalidadeSelector from "@/components/ModalidadeSelector";
import MetodoSelector from "@/components/MetodoSelector";
import GenerateButton from "@/components/GenerateButton";
import ResultCard from "@/components/ResultCard";
import { generateAnalysis, AnalysisResult } from "@/utils/analysisEngine";
import { MODALIDADES } from "@/data/bichoData";
import { ScrollArea } from "@/components/ui/scroll-area";

const Index = () => {
  const [modalidade, setModalidade] = useState<string | null>(null);
  const [metodo, setMetodo] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  const handleGenerate = async () => {
    if (!modalidade || !metodo) return;

    setLoading(true);
    
    // Simulate mystical computation time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const selectedModalidade = MODALIDADES.find(m => m.id === modalidade);
    const digitos = selectedModalidade?.digitos || 2;
    
    const analysisResult = generateAnalysis(metodo, digitos);
    setResult(analysisResult);
    setHistory(prev => [analysisResult, ...prev.slice(0, 4)]);
    setLoading(false);
  };

  const canGenerate = modalidade && metodo;

  return (
    <div className="min-h-screen relative">
      <MysticBackground />
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-10">
            <p className="font-cormorant text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Desvende os mistérios dos números através de 
              <span className="text-gold"> sabedorias ancestrais</span>, 
              <span className="text-mystic-purple"> ciências ocultas</span> e 
              <span className="text-gold-light"> energias cósmicas</span>.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Selection */}
            <div className="space-y-8">
              <div className="p-6 rounded-2xl bg-card/50 border border-gold/10 backdrop-blur-sm">
                <ModalidadeSelector selected={modalidade} onSelect={setModalidade} />
              </div>

              <div className="p-6 rounded-2xl bg-card/50 border border-gold/10 backdrop-blur-sm">
                <ScrollArea className="h-[400px] pr-4">
                  <MetodoSelector selected={metodo} onSelect={setMetodo} />
                </ScrollArea>
              </div>

              <GenerateButton 
                onClick={handleGenerate}
                disabled={!canGenerate}
                loading={loading}
              />
            </div>

            {/* Right Column - Results */}
            <div className="space-y-6">
              {result ? (
                <ResultCard result={result} modalidade={modalidade || ''} />
              ) : (
                <div className="h-full flex items-center justify-center p-8 rounded-2xl border border-dashed border-gold/20 bg-card/30">
                  <div className="text-center">
                    <div className="text-6xl mb-4 opacity-50 animate-float">🔮</div>
                    <h3 className="font-cinzel text-xl text-gold/70 mb-2">
                      Aguardando Revelação
                    </h3>
                    <p className="font-cormorant text-muted-foreground italic">
                      Selecione uma modalidade e um método de análise para consultar o oráculo
                    </p>
                  </div>
                </div>
              )}

              {/* History */}
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

              {/* Disclaimer */}
              <div className="p-4 rounded-xl bg-mystic-purple/10 border border-mystic-purple/20">
                <p className="text-xs text-muted-foreground text-center font-cormorant">
                  ⚠️ Este aplicativo é apenas para entretenimento. Os números gerados são baseados em 
                  interpretações esotéricas e não garantem resultados. Jogue com responsabilidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gold/10 mt-16 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="font-cormorant text-sm text-muted-foreground">
            ✧ Oráculo do Bicho — Sabedoria Mística & Análise Esotérica ✧
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
