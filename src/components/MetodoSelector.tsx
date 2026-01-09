import { METODOS_ANALISE } from "@/data/bichoData";
import { cn } from "@/lib/utils";

interface MetodoSelectorProps {
  selected: string | null;
  onSelect: (id: string) => void;
}

const categoriaLabels: Record<string, string> = {
  matematica: "Matemática Sagrada",
  esoterica: "Esotérica",
  astral: "Astral & Cósmico",
  cientifica: "Científica",
  metafisica: "Metafísica",
  religiosa: "Religiosa",
  ocultismo: "Ocultismo"
};

const MetodoSelector = ({ selected, onSelect }: MetodoSelectorProps) => {
  const categorias = [...new Set(METODOS_ANALISE.map(m => m.categoria))];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-gradient-to-b from-mystic-purple to-accent rounded-full" />
        <h2 className="font-cinzel text-xl text-foreground">Método de Análise</h2>
      </div>

      {categorias.map(categoria => (
        <div key={categoria} className="space-y-2">
          <h3 className="text-sm text-muted-foreground font-cinzel uppercase tracking-widest pl-2">
            {categoriaLabels[categoria]}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {METODOS_ANALISE.filter(m => m.categoria === categoria).map((metodo, index) => (
              <button
                key={metodo.id}
                onClick={() => onSelect(metodo.id)}
                className={cn(
                  "group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300",
                  "border border-gold/10 hover:border-gold/30",
                  "bg-gradient-to-br from-card via-card to-cosmic/30",
                  selected === metodo.id
                    ? "border-gold/50 bg-gold/10 shadow-[0_0_25px_hsl(45_80%_55%/0.2)]"
                    : "hover:bg-gold/5"
                )}
              >
                <span className="text-3xl transition-transform group-hover:scale-110 group-hover:animate-float">
                  {metodo.icone}
                </span>
                <span className={cn(
                  "font-cinzel text-sm text-center transition-colors leading-tight",
                  selected === metodo.id ? "text-gold" : "text-foreground"
                )}>
                  {metodo.nome}
                </span>
                <span className="text-xs text-muted-foreground text-center font-cormorant italic line-clamp-2">
                  {metodo.descricao}
                </span>

                {/* Glow effect when selected */}
                {selected === metodo.id && (
                  <div className="absolute inset-0 rounded-xl bg-gold/5 blur-xl -z-10" />
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetodoSelector;
