import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { interpretarSonho, gerarNumerosSaoCipriano, InterpretacaoSonho } from "@/data/saoCiprianoData";
import { MODALIDADES } from "@/data/bichoData";
import { BookOpen, Sparkles, Moon } from "lucide-react";

const SaoCiprianoForm = () => {
  const [sonho, setSonho] = useState("");
  const [modalidade, setModalidade] = useState<string>("grupo");
  const [interpretacoes, setInterpretacoes] = useState<InterpretacaoSonho[]>([]);
  const [numerosGerados, setNumerosGerados] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const digitos = MODALIDADES.find(m => m.id === modalidade)?.digitos || 2;

  const handleInterpretar = async () => {
    if (!sonho.trim()) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const resultado = interpretarSonho(sonho);
    setInterpretacoes(resultado);
    
    if (resultado.length > 0) {
      const numeros = gerarNumerosSaoCipriano(resultado, digitos);
      setNumerosGerados(numeros);
    } else {
      setNumerosGerados([]);
    }
    
    setLoading(false);
  };

  return (
    <div className="p-6 rounded-2xl bg-card/50 border border-gold/10 backdrop-blur-sm space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-gold mb-2">
          <BookOpen className="w-6 h-6" />
          <h2 className="font-cinzel text-2xl">Livro de São Cipriano</h2>
        </div>
        <p className="text-sm text-muted-foreground font-cormorant">
          Descreva seu sonho e o oráculo revelará os números ocultos
        </p>
      </div>

      {/* Seletor de Modalidade */}
      <div className="space-y-2">
        <label className="font-cinzel text-sm text-foreground">Tipo de Jogo</label>
        <Select value={modalidade} onValueChange={setModalidade}>
          <SelectTrigger className="bg-background/50 border-gold/20 font-cormorant">
            <SelectValue />
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

      <Textarea
        value={sonho}
        onChange={(e) => setSonho(e.target.value)}
        placeholder="Ex: Sonhei que estava em uma casa antiga com uma cobra preta e depois vi água..."
        className="min-h-[120px] bg-background/50 border-gold/20 resize-none font-cormorant"
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

      {/* Números Gerados */}
      {numerosGerados.length > 0 && (
        <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-center">
          <p className="font-cinzel text-sm text-gold/80 mb-2">Números Revelados</p>
          <div className="flex justify-center gap-3">
            {numerosGerados.map((num, i) => (
              <span 
                key={i}
                className="px-4 py-2 rounded-lg bg-gold/20 border border-gold/40 font-cinzel text-2xl text-gold"
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Interpretações */}
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
            Nenhum símbolo reconhecido. Tente usar: animais, pessoas, objetos, cores...
          </p>
        </div>
      )}
    </div>
  );
};

export default SaoCiprianoForm;
