import { useState, useEffect } from 'react';
import { useInteligenciaQuantica, AlertasResponse } from '@/hooks/useInteligenciaQuantica';
import { ANIMAIS } from '@/data/bichoData';
import { Bell, AlertTriangle, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AlertasQuanticos = () => {
  const { obterAlertas } = useInteligenciaQuantica();
  const [alertas, setAlertas] = useState<AlertasResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const carregarAlertas = async () => {
    setLoading(true);
    const data = await obterAlertas();
    setAlertas(data);
    setLoading(false);
  };

  useEffect(() => {
    carregarAlertas();
    // Atualizar a cada 5 minutos
    const interval = setInterval(carregarAlertas, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getAnimalNome = (grupo: number) => {
    return ANIMAIS.find(a => a.grupo === grupo)?.nome || `Grupo ${grupo}`;
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'border-red-500 bg-red-500/10';
      case 'media': return 'border-yellow-500 bg-yellow-500/10';
      default: return 'border-blue-500 bg-blue-500/10';
    }
  };

  const getPrioridadeIcon = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'media': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <TrendingUp className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-card/50 border border-gold/20 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-gold" />
          <h2 className="font-cinzel text-xl text-gold">Alertas Inteligentes</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={carregarAlertas}
          disabled={loading}
          className="text-gold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {alertas?.proximoHorario && (
        <div className="mb-4 p-3 rounded-lg bg-mystic-purple/20 border border-mystic-purple/30">
          <p className="font-cormorant text-sm text-muted-foreground">
            ⏰ Próximo sorteio: <span className="text-gold font-bold">{alertas.proximoHorario}</span>
          </p>
        </div>
      )}

      {/* Alertas */}
      <div className="space-y-3 mb-6">
        {alertas?.alertas.map((alerta, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border ${getPrioridadeColor(alerta.prioridade)}`}
          >
            <div className="flex items-start gap-3">
              {getPrioridadeIcon(alerta.prioridade)}
              <div>
                <p className="font-cormorant text-sm text-foreground">
                  {alerta.mensagem}
                </p>
                {alerta.grupo && (
                  <p className="text-xs text-muted-foreground mt-1">
                    🐾 {getAnimalNome(alerta.grupo)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {(!alertas?.alertas || alertas.alertas.length === 0) && !loading && (
          <p className="text-center text-muted-foreground font-cormorant py-4">
            Nenhum alerta no momento. Cadastre mais resultados para ativar os alertas.
          </p>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 text-gold animate-spin" />
          </div>
        )}
      </div>

      {/* Grupos Atrasados */}
      {alertas?.gruposAtrasados && alertas.gruposAtrasados.length > 0 && (
        <div className="border-t border-gold/10 pt-4">
          <h3 className="font-cinzel text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            Grupos Atrasados (Prováveis)
          </h3>
          <div className="flex flex-wrap gap-2">
            {alertas.gruposAtrasados.map((g, i) => (
              <div 
                key={i}
                className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30"
              >
                <span className="font-cinzel text-sm text-red-400">
                  {g.grupo} - {getAnimalNome(g.grupo)}
                </span>
                <span className="text-xs text-red-300 ml-2">
                  ({g.diasAtrasado} sorteios)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grupos Quentes */}
      {alertas?.gruposQuentes && alertas.gruposQuentes.length > 0 && (
        <div className="border-t border-gold/10 pt-4 mt-4">
          <h3 className="font-cinzel text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Grupos Quentes para {alertas.proximoHorario}
          </h3>
          <div className="flex flex-wrap gap-2">
            {alertas.gruposQuentes.map((g, i) => (
              <div 
                key={i}
                className="px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30"
              >
                <span className="font-cinzel text-sm text-green-400">
                  {g.grupo} - {getAnimalNome(g.grupo)}
                </span>
                <span className="text-xs text-green-300 ml-2">
                  ({g.frequencia}x)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertasQuanticos;
