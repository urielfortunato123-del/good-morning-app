import { useAssinatura } from '@/hooks/useAssinatura';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

export const AssinaturaBadge = () => {
  const { plano, diasRestantes, ativo, loading } = useAssinatura();

  if (loading) {
    return (
      <div className="animate-pulse h-12 bg-muted/30 rounded-xl" />
    );
  }

  if (!ativo || !plano) {
    return null;
  }

  const isUrgent = diasRestantes <= 7;
  const isWarning = diasRestantes <= 15;

  const getPlanLabel = () => {
    switch (plano) {
      case 'mensal': return '30 dias';
      case 'trimestral': return '3 meses';
      case 'semestral': return '6 meses';
      case 'anual': return '12 meses';
      default: return plano;
    }
  };

  return (
    <div className={`
      p-3 rounded-xl border backdrop-blur-sm flex items-center justify-between
      ${isUrgent 
        ? 'bg-red-500/10 border-red-500/30' 
        : isWarning 
          ? 'bg-yellow-500/10 border-yellow-500/30'
          : 'bg-green-500/10 border-green-500/30'
      }
    `}>
      <div className="flex items-center gap-2">
        {isUrgent ? (
          <AlertCircle className="w-5 h-5 text-red-400" />
        ) : (
          <CheckCircle className="w-5 h-5 text-green-400" />
        )}
        <div>
          <p className="font-cinzel text-sm text-foreground">
            Plano {getPlanLabel()}
          </p>
          <p className="text-xs text-muted-foreground">
            Ativo até {new Date(Date.now() + diasRestantes * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
      
      <div className={`
        flex items-center gap-1 px-3 py-1 rounded-full font-mono text-sm font-bold
        ${isUrgent 
          ? 'bg-red-500/20 text-red-400' 
          : isWarning 
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-green-500/20 text-green-400'
        }
      `}>
        <Clock className="w-4 h-4" />
        {diasRestantes} {diasRestantes === 1 ? 'dia' : 'dias'}
      </div>
    </div>
  );
};
