import { AnalysisResult } from "@/utils/analysisEngine";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, Zap, Flame, Clock } from "lucide-react";

interface ResultCardProps {
  result: AnalysisResult;
  modalidade: string;
}

const ResultCard = ({ result, modalidade }: ResultCardProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-card via-cosmic/50 to-card animate-scale-in">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold/40 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold/40 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold/40 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold/40 rounded-br-2xl" />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />

      <div className="relative z-10 p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="font-cinzel text-gold uppercase tracking-widest text-sm">
              Revelação Mística
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20">
            <Zap className="w-4 h-4 text-gold" />
            <span className="text-sm font-cormorant text-gold">{result.energia}</span>
          </div>
        </div>

        {/* Analysis Time Badge */}
        {result.horarioAnalise && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-mystic-purple" />
            <span className="text-sm text-muted-foreground">
              Análise otimizada para extração das <span className="text-gold font-semibold">{result.horarioAnalise}</span>
            </span>
          </div>
        )}

        {/* Numbers Display */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {result.numeros.map((numero, index) => (
            <div
              key={index}
              className="relative group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={cn(
                "w-20 h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center",
                "bg-gradient-to-br from-gold/20 via-gold/10 to-transparent",
                "border-2 border-gold/40 shadow-[0_0_30px_hsl(45_80%_55%/0.2)]",
                "animate-fade-in"
              )}>
                <span className="font-cinzel text-3xl md:text-4xl gold-text font-bold">
                  {numero}
                </span>
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-xl border-2 border-gold/30 animate-ping opacity-30" />
            </div>
          ))}
        </div>

        {/* Animal Group */}
        {result.grupo && (
          <div className="flex items-center justify-center gap-4 mb-6 p-4 rounded-xl bg-mystic-purple/20 border border-mystic-purple/30">
            <div className="text-center">
              <span className="block font-cinzel text-lg text-gold">
                Grupo {result.grupo.grupo}
              </span>
              <span className="block font-cormorant text-2xl text-foreground">
                {result.grupo.nome}
              </span>
              <span className="block text-sm text-muted-foreground">
                ({result.grupo.numeros.join(", ")})
              </span>
            </div>
          </div>
        )}

        {/* Hot Groups Panel */}
        {result.gruposQuentes && result.gruposQuentes.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-cinzel text-sm text-orange-400 uppercase tracking-wider">
                Grupos Quentes (Dados Reais)
              </span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {result.gruposQuentes.map((g, i) => (
                <div 
                  key={i}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium",
                    "bg-gradient-to-r border",
                    g.status === '🔥🔥🔥' 
                      ? "from-red-500/20 to-orange-500/20 border-red-500/40 text-red-400"
                      : g.status === '🔥🔥'
                      ? "from-orange-500/20 to-yellow-500/20 border-orange-500/40 text-orange-400"
                      : "from-yellow-500/20 to-amber-500/20 border-yellow-500/40 text-yellow-400"
                  )}
                >
                  <span className="mr-1">{g.status}</span>
                  <span className="font-cinzel">{g.nome}</span>
                  <span className="text-xs ml-1 opacity-70">({g.grupo})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Confidence Meter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground font-cormorant">Confiança Estatística</span>
            <span className="text-sm font-cinzel text-gold">{result.confianca}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                result.confianca >= 90 
                  ? "bg-gradient-to-r from-green-500 via-emerald-400 to-green-500"
                  : result.confianca >= 80
                  ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light"
                  : "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-400"
              )}
              style={{ width: `${result.confianca}%` }}
            />
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 rounded-xl bg-card/50 border border-gold/10">
          <p className="font-cormorant text-lg text-foreground/90 italic leading-relaxed">
            "{result.explicacao}"
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gold/10 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-cormorant">
            Gerado em {new Date().toLocaleTimeString('pt-BR')}
          </span>
          <div className="flex items-center gap-1 text-xs text-gold">
            <TrendingUp className="w-3 h-3" />
            <span className="font-cinzel">Base: 50+ Extrações</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
