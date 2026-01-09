import { AnalysisResult } from "@/utils/analysisEngine";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, Zap } from "lucide-react";

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

        {/* Confidence Meter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground font-cormorant">Confiança Energética</span>
            <span className="text-sm font-cinzel text-gold">{result.confianca}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light transition-all duration-1000"
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
            <span className="font-cinzel">Alta Vibração</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
