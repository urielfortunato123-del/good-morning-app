import { useAcertosHistorico, Acerto } from "@/hooks/useAcertosHistorico";
import { Trophy, Trash2, TrendingUp, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export const HistoricoAcertos = () => {
  const { acertos, removerAcerto, getEstatisticasAcertos } = useAcertosHistorico();
  const stats = getEstatisticasAcertos();

  if (acertos.length === 0) {
    return (
      <div className="p-6 rounded-xl border border-dashed border-gold/20 bg-card/30 text-center">
        <Trophy className="w-12 h-12 text-gold/30 mx-auto mb-3" />
        <h3 className="font-cinzel text-lg text-gold/70 mb-2">Nenhum Acerto Registrado</h3>
        <p className="font-cormorant text-muted-foreground text-sm">
          Marque seus números vencedores para melhorar as análises futuras
        </p>
      </div>
    );
  }

  // Top métodos que mais acertaram
  const topMetodos = Object.entries(stats.frequenciaMetodos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Top grupos que mais saíram
  const topGrupos = Object.entries(stats.frequenciaGrupos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Estatísticas */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-gold/20 to-yellow-900/20 border border-gold/30">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-gold" />
            <span className="font-cinzel text-sm text-gold">Total de Acertos</span>
          </div>
          <span className="text-3xl font-bold text-gold">{stats.total}</span>
        </div>

        {topMetodos.length > 0 && (
          <div className="p-4 rounded-xl bg-mystic-purple/10 border border-mystic-purple/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-mystic-purple" />
              <span className="font-cinzel text-xs text-mystic-purple">Métodos Top</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {topMetodos.slice(0, 3).map(([metodo, freq]) => (
                <span key={metodo} className="px-2 py-0.5 rounded-full bg-mystic-purple/20 text-xs">
                  {metodo} ({freq})
                </span>
              ))}
            </div>
          </div>
        )}

        {topGrupos.length > 0 && (
          <div className="p-4 rounded-xl bg-green-900/20 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-500" />
              <span className="font-cinzel text-xs text-green-400">Grupos Quentes</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {topGrupos.slice(0, 3).map(([grupo, freq]) => (
                <span key={grupo} className="px-2 py-0.5 rounded-full bg-green-500/20 text-xs text-green-400">
                  Grupo {grupo} ({freq}x)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lista de Acertos */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
        {acertos.map((acerto) => (
          <AcertoItem key={acerto.id} acerto={acerto} onRemove={removerAcerto} />
        ))}
      </div>
    </div>
  );
};

interface AcertoItemProps {
  acerto: Acerto;
  onRemove: (id: string) => void;
}

const AcertoItem = ({ acerto, onRemove }: AcertoItemProps) => {
  return (
    <div className="p-3 rounded-lg bg-gradient-to-r from-gold/10 to-green-900/10 border border-gold/20 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Trophy className="w-5 h-5 text-gold shrink-0" />
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-cinzel text-gold font-semibold">
              {acerto.numeros.join(" • ")}
            </span>
            {acerto.grupo && (
              <span className="px-2 py-0.5 rounded-full bg-gold/20 text-xs text-gold">
                Grupo {acerto.grupo} - {acerto.animal}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Clock className="w-3 h-3" />
            <span>{acerto.data} às {acerto.horario}</span>
            <span className="text-gold/60">• {acerto.modalidade}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => onRemove(acerto.id)}
        className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default HistoricoAcertos;
