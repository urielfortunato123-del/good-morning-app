import { MODALIDADES } from "@/data/bichoData";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface ModalidadeSelectorProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

const ModalidadeSelector = ({ selected, onSelect }: ModalidadeSelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-gold to-gold-dark rounded-full" />
        <h2 className="font-cinzel text-xl text-foreground">Modalidade</h2>
      </div>

      <div className="grid gap-2">
        {MODALIDADES.map((modalidade, index) => (
          <button
            key={modalidade.id}
            onClick={() => onSelect(modalidade.id)}
            className={cn(
              "group relative w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300",
              "border border-gold/10 hover:border-gold/40",
              "bg-gradient-to-r from-card to-transparent",
              selected === modalidade.id
                ? "border-gold/60 bg-gold/10 shadow-[0_0_20px_hsl(45_80%_55%/0.15)]"
                : "hover:bg-gold/5"
            )}
            style={{
              animationDelay: `${index * 50}ms`
            }}
          >
            <div className="flex items-center gap-3">
              <span className={cn(
                "font-cormorant text-lg transition-colors",
                selected === modalidade.id ? "text-gold" : "text-foreground group-hover:text-gold-light"
              )}>
                {modalidade.nome}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className={cn(
                "font-cinzel text-sm font-semibold transition-colors",
                selected === modalidade.id ? "text-gold" : "text-gold/60"
              )}>
                {modalidade.multiplicador}
              </span>
              <ChevronRight className={cn(
                "w-4 h-4 transition-all",
                selected === modalidade.id 
                  ? "text-gold translate-x-0" 
                  : "text-muted-foreground -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"
              )} />
            </div>

            {/* Selection indicator */}
            {selected === modalidade.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-gold via-gold-light to-gold rounded-r-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModalidadeSelector;
