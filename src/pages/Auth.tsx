import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import MysticBackground from '@/components/MysticBackground';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Cadastro
  const [signupNome, setSignupNome] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    setLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    setLoading(false);
    
    if (error) {
      toast.error(error.message === 'Invalid login credentials' 
        ? 'Email ou senha incorretos' 
        : error.message);
    } else {
      toast.success('Login realizado com sucesso!');
      navigate('/');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupEmail || !signupPassword || !signupNome) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    if (signupPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    const { error } = await signUp(signupEmail, signupPassword, signupNome);
    setLoading(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Cadastro realizado! Aguarde a liberação do acesso.');
      navigate('/aguardando');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <MysticBackground />
      
      <Card className="w-full max-w-md bg-card/90 backdrop-blur-sm border-gold/30">
        <CardHeader className="text-center">
          <div className="text-5xl mb-2">🔮</div>
          <CardTitle className="font-cinzel text-2xl bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
            Oráculo do Bicho
          </CardTitle>
          <CardDescription className="font-cormorant text-muted-foreground">
            Acesse sua conta para usar a IA Quântica
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="login" className="font-cinzel">Entrar</TabsTrigger>
              <TabsTrigger value="signup" className="font-cinzel">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="font-cinzel text-sm">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="bg-background/50 border-gold/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="font-cinzel text-sm">Senha</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-background/50 border-gold/30 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-cinzel hover:opacity-90"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-nome" className="font-cinzel text-sm">Nome</Label>
                  <Input
                    id="signup-nome"
                    type="text"
                    placeholder="Seu nome"
                    value={signupNome}
                    onChange={(e) => setSignupNome(e.target.value)}
                    className="bg-background/50 border-gold/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="font-cinzel text-sm">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="bg-background/50 border-gold/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="font-cinzel text-sm">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="bg-background/50 border-gold/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm" className="font-cinzel text-sm">Confirmar Senha</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Repita a senha"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="bg-background/50 border-gold/30"
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-gold to-yellow-500 text-black font-cinzel hover:opacity-90"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar Conta'}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground font-cormorant">
                  Após o cadastro, seu acesso será liberado após confirmação do pagamento.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
