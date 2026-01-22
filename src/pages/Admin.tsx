import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import MysticBackground from '@/components/MysticBackground';
import { 
  Shield, Users, Plus, Trash2, ArrowLeft, RefreshCw, 
  UserCheck, UserX, Search, Calendar
} from 'lucide-react';

interface UsuarioAutorizado {
  id: string;
  email: string;
  autorizado: boolean;
  plano: string;
  data_autorizacao: string | null;
  data_expiracao: string | null;
  observacoes: string | null;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioAutorizado[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Novo usuário
  const [novoEmail, setNovoEmail] = useState('');
  const [novoPlano, setNovoPlano] = useState('mensal');
  const [novaDuracao, setNovaDuracao] = useState('30');
  const [adicionando, setAdicionando] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
    if (!loading && user && !isAdmin) {
      toast.error('Acesso negado: você não é administrador');
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsuarios();
    }
  }, [isAdmin]);

  const fetchUsuarios = async () => {
    setLoadingUsuarios(true);
    const { data, error } = await supabase
      .from('usuarios_autorizados')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar usuários');
      console.error(error);
    } else {
      setUsuarios(data || []);
    }
    setLoadingUsuarios(false);
  };

  const handleAddUsuario = async () => {
    if (!novoEmail) {
      toast.error('Informe o email');
      return;
    }

    setAdicionando(true);
    
    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + parseInt(novaDuracao));

    const { error } = await supabase
      .from('usuarios_autorizados')
      .insert({
        email: novoEmail.toLowerCase().trim(),
        autorizado: true,
        plano: novoPlano,
        data_autorizacao: new Date().toISOString(),
        data_expiracao: dataExpiracao.toISOString(),
      });

    setAdicionando(false);

    if (error) {
      if (error.code === '23505') {
        toast.error('Este email já está cadastrado');
      } else {
        toast.error('Erro ao adicionar usuário');
        console.error(error);
      }
    } else {
      toast.success('Usuário autorizado com sucesso!');
      setNovoEmail('');
      fetchUsuarios();
    }
  };

  const toggleAutorizacao = async (id: string, autorizado: boolean) => {
    const updates: any = { 
      autorizado: !autorizado 
    };
    
    if (!autorizado) {
      // Se estava desautorizado e agora vai autorizar
      updates.data_autorizacao = new Date().toISOString();
    }

    const { error } = await supabase
      .from('usuarios_autorizados')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar autorização');
    } else {
      toast.success(autorizado ? 'Acesso removido' : 'Acesso liberado');
      fetchUsuarios();
    }
  };

  const deleteUsuario = async (id: string, email: string) => {
    if (!confirm(`Remover ${email} da lista?`)) return;

    const { error } = await supabase
      .from('usuarios_autorizados')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao remover usuário');
    } else {
      toast.success('Usuário removido');
      fetchUsuarios();
    }
  };

  const filteredUsuarios = usuarios.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const isExpired = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MysticBackground />
        <div className="text-center">
          <div className="text-6xl animate-pulse mb-4">🔐</div>
          <p className="text-gold font-cinzel">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <MysticBackground />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="text-gold hover:bg-gold/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-cinzel text-2xl flex items-center gap-2">
                  <Shield className="w-6 h-6 text-gold" />
                  <span className="bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
                    Painel Administrativo
                  </span>
                </h1>
                <p className="text-sm text-muted-foreground font-cormorant">
                  Gerencie os acessos dos usuários
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={fetchUsuarios}
              className="border-gold/30 text-gold hover:bg-gold/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>

          {/* Adicionar Usuário */}
          <Card className="bg-card/90 backdrop-blur-sm border-gold/30">
            <CardHeader>
              <CardTitle className="font-cinzel text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-gold" />
                Autorizar Novo Usuário
              </CardTitle>
              <CardDescription className="font-cormorant">
                Adicione um email e libere o acesso após confirmação do pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="font-cinzel text-sm">Email</Label>
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={novoEmail}
                    onChange={(e) => setNovoEmail(e.target.value)}
                    className="bg-background/50 border-gold/30"
                  />
                </div>
                
                <div className="w-full md:w-40 space-y-2">
                  <Label className="font-cinzel text-sm">Plano</Label>
                  <Select value={novoPlano} onValueChange={setNovoPlano}>
                    <SelectTrigger className="bg-background/50 border-gold/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-40 space-y-2">
                  <Label className="font-cinzel text-sm">Duração (dias)</Label>
                  <Select value={novaDuracao} onValueChange={setNovaDuracao}>
                    <SelectTrigger className="bg-background/50 border-gold/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="90">90 dias</SelectItem>
                      <SelectItem value="180">180 dias</SelectItem>
                      <SelectItem value="365">365 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    onClick={handleAddUsuario}
                    disabled={adicionando}
                    className="w-full md:w-auto bg-gradient-to-r from-gold to-yellow-500 text-black font-cinzel hover:opacity-90"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Autorizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Usuários */}
          <Card className="bg-card/90 backdrop-blur-sm border-gold/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-cinzel text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-gold" />
                    Usuários Cadastrados
                  </CardTitle>
                  <CardDescription className="font-cormorant">
                    {usuarios.length} usuário(s) no sistema
                  </CardDescription>
                </div>
                
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-background/50 border-gold/30"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loadingUsuarios ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin text-gold mx-auto mb-2" />
                  <p className="text-muted-foreground">Carregando...</p>
                </div>
              ) : filteredUsuarios.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gold/20">
                        <TableHead className="font-cinzel">Email</TableHead>
                        <TableHead className="font-cinzel">Status</TableHead>
                        <TableHead className="font-cinzel">Plano</TableHead>
                        <TableHead className="font-cinzel">Autorizado em</TableHead>
                        <TableHead className="font-cinzel">Expira em</TableHead>
                        <TableHead className="font-cinzel text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsuarios.map((usuario) => (
                        <TableRow key={usuario.id} className="border-gold/10">
                          <TableCell className="font-cormorant">{usuario.email}</TableCell>
                          <TableCell>
                            {usuario.autorizado && !isExpired(usuario.data_expiracao) ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                <UserCheck className="w-3 h-3 mr-1" />
                                Ativo
                              </Badge>
                            ) : isExpired(usuario.data_expiracao) ? (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                <Calendar className="w-3 h-3 mr-1" />
                                Expirado
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                <UserX className="w-3 h-3 mr-1" />
                                Pendente
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="font-cormorant capitalize">{usuario.plano}</TableCell>
                          <TableCell className="font-cormorant">{formatDate(usuario.data_autorizacao)}</TableCell>
                          <TableCell className={`font-cormorant ${isExpired(usuario.data_expiracao) ? 'text-red-400' : ''}`}>
                            {formatDate(usuario.data_expiracao)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {usuario.autorizado ? 'Ativo' : 'Inativo'}
                                </span>
                                <Switch
                                  checked={usuario.autorizado}
                                  onCheckedChange={() => toggleAutorizacao(usuario.id, usuario.autorizado)}
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteUsuario(usuario.id, usuario.email)}
                                className="text-red-400 hover:bg-red-500/20 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
