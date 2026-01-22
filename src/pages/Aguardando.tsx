import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MysticBackground from '@/components/MysticBackground';
import { Clock, Mail, CheckCircle2, CreditCard, RefreshCw } from 'lucide-react';

export default function Aguardando() {
  const navigate = useNavigate();
  const { user, isAuthorized, loading, signOut, refreshAccess } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
    if (!loading && isAuthorized) {
      navigate('/');
    }
  }, [user, isAuthorized, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleRefresh = () => {
    refreshAccess();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MysticBackground />
        <div className="text-center">
          <div className="text-6xl animate-pulse mb-4">🔮</div>
          <p className="text-gold font-cinzel">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <MysticBackground />
      
      <Card className="w-full max-w-lg bg-card/90 backdrop-blur-sm border-gold/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-yellow-500/20 border border-yellow-500/30">
              <Clock className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
          <CardTitle className="font-cinzel text-2xl text-yellow-500">
            Aguardando Liberação
          </CardTitle>
          <CardDescription className="font-cormorant text-lg text-muted-foreground">
            Seu acesso será liberado após confirmação do pagamento
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 rounded-xl bg-muted/50 border border-gold/20">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-gold" />
              <span className="font-cormorant text-foreground">{user?.email}</span>
            </div>
            <p className="text-sm text-muted-foreground font-cormorant">
              Este email foi registrado. O administrador irá liberar seu acesso assim que o pagamento for confirmado.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-cinzel text-sm text-gold uppercase tracking-wider">
              Planos Disponíveis
            </h3>
            
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-gradient-to-r from-gold/10 to-yellow-500/10 border border-gold/20">
                <div className="flex justify-between items-center">
                  <span className="font-cinzel text-foreground">Mensal</span>
                  <span className="font-cinzel text-gold">R$ 79,90</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">+ Taxa de adesão: R$ 35,90</p>
              </div>
              
              <div className="p-3 rounded-lg bg-gradient-to-r from-gold/10 to-yellow-500/10 border border-gold/20">
                <div className="flex justify-between items-center">
                  <span className="font-cinzel text-foreground">Trimestral</span>
                  <span className="font-cinzel text-gold">3x R$ 99,29</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total: R$ 239,70 + Taxa de adesão: R$ 35,90</p>
              </div>
              
              <div className="p-3 rounded-lg bg-gradient-to-r from-gold/10 to-yellow-500/10 border border-gold/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gold text-black text-xs px-2 py-0.5 font-cinzel">
                  MELHOR
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-cinzel text-foreground">Anual</span>
                  <span className="font-cinzel text-gold">12x R$ 78,26</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Total: R$ 698,99 + Taxa de adesão: R$ 35,90</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-green-500" />
              <span className="font-cinzel text-sm text-green-500">Formas de Pagamento</span>
            </div>
            <p className="text-sm text-muted-foreground font-cormorant">
              PIX (à vista) • Cartão de Crédito (parcelado)
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="w-full border-gold/30 text-gold hover:bg-gold/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Verificar Liberação
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Sair da Conta
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="font-cormorant">Pagamento 100% seguro</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
