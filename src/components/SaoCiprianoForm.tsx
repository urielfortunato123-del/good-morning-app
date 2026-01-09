import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { interpretarSonho, gerarNumerosSaoCipriano, InterpretacaoSonho } from "@/data/saoCiprianoData";
import { ANIMAIS } from "@/data/bichoData";
import { BookOpen, Sparkles, Moon } from "lucide-react";

interface SaoCiprianoFormProps {
  onResult: (numeros: string[], interpretacoes: InterpretacaoSonho[]) => void;
  digitos: number;
}

const SaoCiprianoForm = ({ onResult, digitos }: SaoCiprianoFormProps) => {
  const [sonho, setSonho] = useState("");
  const [interpretacoes, setInterpretacoes] = useState<InterpretacaoSonho[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInterpretar = async () => {
    if (!sonho.trim()) return;
    
    setLoading(true);
    
    // Simular processamento místico
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const resultado = interpretarSonho(sonho);
    setInterpretacoes(resultado);
    
    if (resultado.length > 0) {
      const numeros = gerarNumerosSaoCipriano(resultado, digitos);
      onResult(numeros, resultado);
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gold">
        <BookOpen className="w-5 h-5" />
        <h3 className="font-cinzel text-lg">Livro de São Cipriano</h3>
      </div>
      
      <p className="text-sm text-muted-foreground font-cormorant">
        Descreva seu sonho e o oráculo revelará os números ocultos segundo a tradição de São Cipriano...
      </p>

      <Textarea
        value={sonho}
        onChange={(e) => setSonho(e.target.value)}
        placeholder="Ex: Sonhei que estava em uma casa antiga com uma cobra preta e depois vi água..."
        className="min-h-[100px] bg-background/50 border-gold/20 resize-none font-cormorant"
      />

      <Button
        onClick={handleInterpretar}
        disabled={!sonho.trim() || loading}
        className="w-full bg-gradient-to-r from-mystic-purple to-mystic-purple-dark hover:opacity-90"
      >
        {loading ? (
          <>
            <Moon className="w-4 h-4 mr-2 animate-pulse" />
            Consultando os mistérios...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Interpretar Sonho
          </>
        )}
      </Button>

      {interpretacoes.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gold/10">
          <h4 className="font-cinzel text-sm text-gold/80">✨ Símbolos Encontrados:</h4>
          <div className="space-y-2">
            {interpretacoes.map((interp, i) => (
              <div 
                key={i}
                className="p-3 rounded-lg bg-mystic-purple/10 border border-mystic-purple/20"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-cinzel text-gold capitalize">{interp.palavra}</span>
                  <span className="text-sm text-mystic-purple">
                    Grupo {interp.grupo} - {interp.animal}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground italic font-cormorant">
                  "{interp.significado}"
                </p>
                <div className="flex gap-1 mt-2">
                  {interp.dezenas.map(d => (
                    <span key={d} className="px-2 py-0.5 rounded bg-gold/10 text-gold text-xs font-mono">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {interpretacoes.length === 0 && sonho.trim() && !loading && (
        <div className="p-4 rounded-lg bg-muted/30 text-center">
          <p className="text-sm text-muted-foreground font-cormorant">
            Nenhum símbolo reconhecido. Tente descrever com mais detalhes usando palavras como: 
            animais, pessoas, objetos, ações, cores, lugares...
          </p>
        </div>
      )}
    </div>
  );
};

export default SaoCiprianoForm;
