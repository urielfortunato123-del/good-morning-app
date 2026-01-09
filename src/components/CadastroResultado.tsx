import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useResultadosHistoricos, getGrupoFromDezena } from "@/hooks/useResultadosHistoricos";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus, Calendar, Clock, Trophy, Download, Upload, BarChart3 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

const HORARIOS = [
  { value: "09h", label: "09h - PT/PPT" },
  { value: "11h", label: "11h - PTM" },
  { value: "14h", label: "14h - PT" },
  { value: "16h", label: "16h - PTV" },
  { value: "18h", label: "18h - PTN" },
  { value: "21h", label: "21h - Coruja" },
];

const PREMIOS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CadastroResultado = () => {
  const { resultados, salvarResultado, removerResultado, limparTodos, exportarDados, importarDados, getEstatisticas } = useResultadosHistoricos();
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [horario, setHorario] = useState<string>("");
  const [premio, setPremio] = useState<string>("");
  const [milhar, setMilhar] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!data || !horario || !premio || !milhar) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    if (milhar.length < 2 || milhar.length > 4) {
      toast({
        title: "Milhar inválida",
        description: "Digite entre 2 e 4 dígitos",
        variant: "destructive",
      });
      return;
    }

    const milharPadded = milhar.padStart(4, '0');
    
    salvarResultado({
      data,
      horario,
      premio: parseInt(premio),
      milhar: milharPadded,
    });

    const { animal } = getGrupoFromDezena(milharPadded.slice(-2));
    
    toast({
      title: "✅ Resultado cadastrado!",
      description: `${milharPadded} - ${animal}`,
    });

    setMilhar("");
    setPremio("");
  };

  const handleExport = () => {
    const json = exportarDados();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oraculo-resultados-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "📥 Exportado!",
      description: `${resultados.length} resultados salvos`,
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const sucesso = importarDados(content);
      if (sucesso) {
        toast({
          title: "📤 Importado!",
          description: "Dados carregados com sucesso",
        });
      } else {
        toast({
          title: "❌ Erro",
          description: "Arquivo inválido",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const stats = getEstatisticas();

  return (
    <div className="space-y-6">
      {/* Formulário */}
      <div className="p-6 rounded-2xl bg-card/50 border border-gold/10 backdrop-blur-sm">
        <h3 className="font-cinzel text-lg text-gold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Cadastrar Resultado
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Data
              </Label>
              <Input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="bg-background/50 border-gold/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> Horário
              </Label>
              <Select value={horario} onValueChange={setHorario}>
                <SelectTrigger className="bg-background/50 border-gold/20">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {HORARIOS.map(h => (
                    <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-1">
                <Trophy className="w-3 h-3" /> Prêmio
              </Label>
              <Select value={premio} onValueChange={setPremio}>
                <SelectTrigger className="bg-background/50 border-gold/20">
                  <SelectValue placeholder="1º ao 10º" />
                </SelectTrigger>
                <SelectContent>
                  {PREMIOS.map(p => (
                    <SelectItem key={p} value={p.toString()}>{p}º Prêmio</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-muted-foreground">Milhar/Dezena</Label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                value={milhar}
                onChange={(e) => setMilhar(e.target.value.replace(/\D/g, ''))}
                placeholder="Ex: 1234"
                className="bg-background/50 border-gold/20 font-mono text-lg"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-gold to-gold-dark hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar
          </Button>
        </form>
      </div>

      {/* Ações Export/Import/Dashboard */}
      <div className="flex flex-wrap gap-2">
        <Link to="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full border-gold/20 hover:bg-gold/10">
            <BarChart3 className="w-4 h-4 mr-2" />
            Ver Dashboard
          </Button>
        </Link>
        <Button 
          variant="outline" 
          onClick={handleExport}
          disabled={resultados.length === 0}
          className="border-gold/20 hover:bg-gold/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
        <Button 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          className="border-gold/20 hover:bg-gold/10"
        >
          <Upload className="w-4 h-4 mr-2" />
          Importar
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      {/* Estatísticas Rápidas */}
      {stats.gruposOrdenados.length > 0 && (
        <div className="p-4 rounded-xl bg-mystic-purple/10 border border-mystic-purple/20">
          <h4 className="font-cinzel text-sm text-gold mb-3">🔥 Top Grupos Cadastrados</h4>
          <div className="flex flex-wrap gap-2">
            {stats.gruposOrdenados.slice(0, 5).map((g, i) => (
              <span 
                key={g.grupo}
                className={`px-3 py-1 rounded-full text-sm font-mono ${
                  i === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  i < 3 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  'bg-muted/50 text-muted-foreground border border-muted'
                }`}
              >
                {g.animal} ({g.frequencia}x)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Resultados */}
      {resultados.length > 0 && (
        <div className="p-4 rounded-xl bg-card/30 border border-gold/10">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-cinzel text-sm text-muted-foreground">
              📋 Últimos Cadastros ({resultados.length})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={limparTodos}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Limpar
            </Button>
          </div>
          
          <ScrollArea className="h-[200px]">
            <div className="space-y-2 pr-4">
              {resultados.slice(0, 20).map(r => (
                <div 
                  key={r.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-20">{r.data}</span>
                    <span className="text-xs text-gold/70 w-10">{r.horario}</span>
                    <span className="text-xs text-muted-foreground w-12">{r.premio}º</span>
                    <span className="font-mono text-gold font-bold">{r.milhar}</span>
                    <span className="text-sm text-muted-foreground">→ {r.animal}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removerResultado(r.id)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default CadastroResultado;
