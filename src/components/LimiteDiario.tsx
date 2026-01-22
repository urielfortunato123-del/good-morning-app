import { useUsoDiario } from '@/hooks/useUsoDiario';
import { Zap, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export const LimiteDiario = () => {
  const { geracoes, geracoesRestantes, podeGerar, LIMITE_DIARIO, loading } = useUsoDiario();

  if (loading) {
    return (
      <div className="animate-pulse h-12 bg-muted/30 rounded-xl" />
    );
  }

  const percentual = (geracoes / LIMITE_DIARIO) * 100;
  const isWarning = geracoesRestantes <= 10;
  const isUrgent = geracoesRestantes <= 5;

  return (
    <div className={`
      p-3 rounded-xl border backdrop-blur-sm
      ${isUrgent 
        ? 'bg-red-500/10 border-red-500/30' 
        : isWarning 
          ? 'bg-yellow-500/10 border-yellow-500/30'
          : 'bg-card/50 border-gold/20'
      }
    `}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isUrgent ? (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          ) : (
            <Zap className="w-4 h-4 text-gold" />
          )}
          <span className="font-cinzel text-sm text-foreground">
            Gerações Hoje
          </span>
        </div>
        <span className={`
          font-mono text-sm font-bold
          ${isUrgent ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-gold'}
        `}>
          {geracoesRestantes}/{LIMITE_DIARIO}
        </span>
      </div>
      
      <Progress 
        value={percentual} 
        className={`h-2 ${isUrgent ? '[&>div]:bg-red-500' : isWarning ? '[&>div]:bg-yellow-500' : '[&>div]:bg-gold'}`}
      />
      
      {!podeGerar && (
        <p className="text-xs text-red-400 mt-2 text-center">
          Limite diário atingido! Volte amanhã.
        </p>
      )}
    </div>
  );
};
