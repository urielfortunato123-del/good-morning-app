import { AnalysisResult } from "@/utils/analysisEngine";
import { cn } from "@/lib/utils";
import { Sparkles, TrendingUp, Zap, Flame, Clock, DollarSign, Trophy, Check } from "lucide-react";
import { useAcertosHistorico } from "@/hooks/useAcertosHistorico";
import { useState } from "react";
import { toast } from "sonner";

interface ResultCardProps {
  result: AnalysisResult;
  modalidade: string;
  data?: string;
  horario?: string;
}

const ResultCard = ({ result, modalidade, data, horario }: ResultCardProps) => {
  const { salvarAcerto } = useAcertosHistorico();
  const [marcado, setMarcado] = useState(false);

  const handleMarcarAcerto = () => {
    salvarAcerto({
      numeros: result.numeros,
      grupo: result.grupo?.grupo,
      animal: result.grupo?.nome,
      modalidade,
      data: data || new Date().toISOString().split('T')[0],
      horario: horario || result.horarioAnalise || '',
      metodosUsados: result.metodosUsados || [],
    });
    setMarcado(true);
    toast.success("🏆 Acerto registrado! Isso vai melhorar suas próximas análises.");
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-yellow-900/20 via-card to-green-900/20 animate-scale-in shadow-[0_0_40px_rgba(234,179,8,0.3)]">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-gold/60 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-gold/60 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-gold/60 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-gold/60 rounded-br-2xl" />

      {/* Money decorations */}
      <div className="absolute top-4 right-4 text-4xl opacity-30 animate-float">💰</div>
      <div className="absolute bottom-4 left-4 text-3xl opacity-30 animate-float" style={{ animationDelay: "0.7s" }}>💶</div>
      <div className="absolute top-1/3 right-8 text-2xl opacity-20 animate-float" style={{ animationDelay: "1.4s" }}>💵</div>

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold/15 rounded-full blur-3xl" />

      <div className="relative z-10 p-6 md:p-8">
        {/* Boost de Acertos Históricos */}
        {result.usouAcertosHistoricos && (
          <div className="flex items-center justify-center gap-2 mb-4 p-2 rounded-lg bg-green-500/20 border border-green-500/40">
            <Trophy className="w-5 h-5 text-green-400" />
            <span className="font-cinzel text-sm text-green-400">
              Potencializado pelos seus Acertos Anteriores!
            </span>
            <Trophy className="w-5 h-5 text-green-400" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <DollarSign className="w-6 h-6 text-gold animate-pulse" />
          <span className="font-cinzel text-xl bg-gradient-to-r from-yellow-400 via-gold to-yellow-500 bg-clip-text text-transparent uppercase tracking-widest">
            Números da Prosperidade
          </span>
          <DollarSign className="w-6 h-6 text-gold animate-pulse" />
        </div>

        {/* Analysis Time Badge */}
        {result.horarioAnalise && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-gold" />
            <span className="text-sm text-muted-foreground">
              Otimizado para <span className="text-gold font-semibold">{result.horarioAnalise}</span>
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
                "bg-gradient-to-br from-yellow-500/30 via-gold/20 to-green-500/20",
                "border-2 border-gold/60 shadow-[0_0_40px_rgba(234,179,8,0.4)]",
                "animate-fade-in"
              )}>
                <span className="font-cinzel text-3xl md:text-4xl text-gold font-bold drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                  {numero}
                </span>
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-xl border-2 border-gold/40 animate-ping opacity-40" />
            </div>
          ))}
        </div>

        {/* Animal Group */}
        {result.grupo && (
          <div className="flex items-center justify-center gap-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-gold/20 via-transparent to-gold/20 border border-gold/40">
            <div className="text-center">
              <span className="block font-cinzel text-lg text-gold">
                💰 Grupo {result.grupo.grupo} 💰
              </span>
              <span className="block font-cormorant text-3xl text-foreground font-semibold">
                {result.grupo.nome}
              </span>
              <span className="block text-sm text-gold/70">
                ({result.grupo.numeros.join(", ")})
              </span>
            </div>
          </div>
        )}

        {/* Methods Used */}
        {result.metodosUsados && (
          <div className="mb-6 p-3 rounded-xl bg-mystic-purple/10 border border-mystic-purple/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-mystic-purple" />
              <span className="font-cinzel text-xs text-mystic-purple uppercase tracking-wider">
                Métodos Convergentes
              </span>
            </div>
            <div className="flex flex-wrap gap-1 justify-center text-xs">
              {result.metodosUsados.map((m, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full bg-mystic-purple/20 text-muted-foreground">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Hot Groups Panel */}
        {result.gruposQuentes && result.gruposQuentes.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-3 justify-center">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-cinzel text-sm text-orange-400 uppercase tracking-wider">
                Grupos em Alta
              </span>
              <Flame className="w-5 h-5 text-orange-500" />
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
            <span className="text-sm text-muted-foreground font-cormorant">Nível de Convergência</span>
            <span className="text-sm font-cinzel text-gold">{result.confianca}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                "bg-gradient-to-r from-yellow-600 via-gold to-green-500"
              )}
              style={{ width: `${result.confianca}%` }}
            />
          </div>
        </div>

        {/* Explanation */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-gold/10 via-transparent to-gold/10 border border-gold/20">
          <p className="font-cormorant text-lg text-foreground/90 italic leading-relaxed text-center">
            {result.explicacao}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gold/20 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-cormorant">
            💰 {new Date().toLocaleTimeString('pt-BR')}
          </span>
          
          {/* Botão Marcar Acerto */}
          <button
            onClick={handleMarcarAcerto}
            disabled={marcado}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-cinzel text-sm transition-all",
              marcado 
                ? "bg-green-500/20 text-green-400 border border-green-500/40 cursor-default"
                : "bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30 hover:border-gold/60"
            )}
          >
            {marcado ? (
              <>
                <Check className="w-4 h-4" />
                Acerto Registrado!
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4" />
                Marcar como Acerto
              </>
            )}
          </button>

          <div className="flex items-center gap-1 text-xs text-gold">
            <TrendingUp className="w-3 h-3" />
            <span className="font-cinzel">11 Métodos Unidos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
