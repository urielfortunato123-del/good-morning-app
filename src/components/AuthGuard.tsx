import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import MysticBackground from '@/components/MysticBackground';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const { user, isAuthorized, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAuthorized) {
        navigate('/aguardando');
      }
    }
  }, [user, isAuthorized, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MysticBackground />
        <div className="text-center">
          <div className="text-6xl animate-pulse mb-4">🔮</div>
          <p className="text-gold font-cinzel">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
