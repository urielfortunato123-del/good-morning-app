import { ANIMAIS, ANIMAIS_EMOJI } from "@/data/bichoData";
import { cn } from "@/lib/utils";

const TabelaAnimais = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="font-cinzel text-xl bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent">
          🎰 Tabela Completa dos 25 Bichos
        </h2>
        <p className="font-cormorant text-muted-foreground text-sm">
          Grupos, animais e dezenas correspondentes
        </p>
      </div>

      {/* Grid de animais */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {ANIMAIS.map((animal) => (
          <div
            key={animal.grupo}
            className={cn(
              "p-3 rounded-lg border transition-all",
              "bg-gradient-to-br from-card to-card/50 border-gold/20",
              "hover:border-gold/40 hover:shadow-[0_0_15px_rgba(234,179,8,0.1)]"
            )}
          >
            <div className="flex items-center gap-3">
              {/* Emoji e Grupo */}
              <div className="flex flex-col items-center justify-center min-w-[50px]">
                <span className="text-2xl">{ANIMAIS_EMOJI[animal.grupo]}</span>
                <span className="text-xs text-gold font-mono font-bold">
                  G{animal.grupo.toString().padStart(2, "0")}
                </span>
              </div>

              {/* Nome e Dezenas */}
              <div className="flex-1">
                <h3 className="font-cinzel text-sm text-foreground mb-1">
                  {animal.nome}
                </h3>
                <div className="flex gap-1 flex-wrap">
                  {animal.numeros.map((num) => (
                    <span
                      key={num}
                      className="px-1.5 py-0.5 rounded bg-gold/10 text-gold text-xs font-mono border border-gold/20"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legenda */}
      <div className="p-3 rounded-lg bg-muted/30 border border-border">
        <p className="text-xs text-muted-foreground text-center">
          💡 <strong>Dica:</strong> A dezena do resultado define o grupo. Ex: Resultado 1234 → dezena 34 → Grupo 9 (Cobra)
        </p>
      </div>
    </div>
  );
};

export default TabelaAnimais;
