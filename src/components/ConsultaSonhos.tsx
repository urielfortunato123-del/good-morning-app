import { useState } from "react";
import { ANIMAIS, ANIMAIS_EMOJI, SONHOS_ANIMAIS } from "@/data/bichoData";
import { Search, Sparkles, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ConsultaSonhos = () => {
  const [sonho, setSonho] = useState("");
  const [resultados, setResultados] = useState<typeof ANIMAIS>([]);
  const [buscou, setBuscou] = useState(false);

  const buscarSonho = () => {
    if (!sonho.trim()) return;
    
    const termo = sonho.toLowerCase().trim();
    const gruposEncontrados = new Set<number>();
    
    // Buscar matches diretos
    Object.entries(SONHOS_ANIMAIS).forEach(([palavra, grupos]) => {
      if (termo.includes(palavra) || palavra.includes(termo)) {
        grupos.forEach(g => gruposEncontrados.add(g));
      }
    });
    
    // Se não encontrou, buscar por similaridade parcial
    if (gruposEncontrados.size === 0) {
      Object.entries(SONHOS_ANIMAIS).forEach(([palavra, grupos]) => {
        const palavras = termo.split(" ");
        palavras.forEach(p => {
          if (p.length >= 3 && (palavra.includes(p) || p.includes(palavra.slice(0, 3)))) {
            grupos.forEach(g => gruposEncontrados.add(g));
          }
        });
      });
    }
    
    const animaisEncontrados = ANIMAIS.filter(a => gruposEncontrados.has(a.grupo));
    setResultados(animaisEncontrados);
    setBuscou(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      buscarSonho();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Moon className="w-6 h-6 text-purple-400" />
          <h2 className="font-cinzel text-xl bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
            Consulta de Sonhos
          </h2>
          <Moon className="w-6 h-6 text-purple-400" />
        </div>
        <p className="font-cormorant text-muted-foreground text-sm">
          Digite o que você sonhou e descubra o animal correspondente
        </p>
      </div>

      {/* Busca */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={sonho}
            onChange={(e) => setSonho(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex: sonhei com água, cobra, dinheiro..."
            className="pl-10 bg-background/50 border-purple-500/30 focus:border-purple-500/60"
          />
        </div>
        <Button
          onClick={buscarSonho}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Interpretar
        </Button>
      </div>

      {/* Resultados */}
      {buscou && (
        <div className="space-y-4">
          {resultados.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground text-center">
                🌙 Seu sonho indica {resultados.length} {resultados.length === 1 ? "animal" : "animais"}:
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {resultados.map((animal) => (
                  <div
                    key={animal.grupo}
                    className={cn(
                      "p-4 rounded-xl border transition-all",
                      "bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30",
                      "hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{ANIMAIS_EMOJI[animal.grupo]}</span>
                      <div>
                        <h3 className="font-cinzel text-lg text-purple-300">
                          {animal.nome}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Grupo {animal.grupo.toString().padStart(2, "0")}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {animal.numeros.map((num) => (
                        <span
                          key={num}
                          className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-sm font-mono"
                        >
                          {num}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center p-6 rounded-xl bg-muted/30 border border-dashed border-muted-foreground/30">
              <p className="text-muted-foreground">
                😴 Não encontramos esse sonho na tabela tradicional.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tente palavras como: água, dinheiro, cobra, casamento, bebê, etc.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Dica */}
      <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
        <p className="text-xs text-purple-300 text-center">
          💡 Baseado no Livro de São Cipriano e tradição popular do jogo do bicho
        </p>
      </div>
    </div>
  );
};

export default ConsultaSonhos;
