import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isAuthorized: boolean;
  loading: boolean;
  plano: string | null;
  dataExpiracao: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAdmin: false,
    isAuthorized: false,
    loading: true,
    plano: null,
    dataExpiracao: null,
  });

  useEffect(() => {
    // Listener primeiro
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          // Verificar role e autorização
          await checkUserAccess(session.user);
        } else {
          setAuthState({
            user: null,
            session: null,
            isAdmin: false,
            isAuthorized: false,
            loading: false,
            plano: null,
            dataExpiracao: null,
          });
        }
      }
    );

    // Depois buscar sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkUserAccess(session.user);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserAccess = async (user: User) => {
    try {
      // Verificar se é admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      const isAdmin = roleData?.role === 'admin';

      // Verificar autorização
      const { data: authData } = await supabase
        .from('usuarios_autorizados')
        .select('autorizado, plano, data_expiracao')
        .eq('email', user.email)
        .single();

      const isAuthorized = isAdmin || (authData?.autorizado && 
        (!authData.data_expiracao || new Date(authData.data_expiracao) > new Date()));

      setAuthState({
        user,
        session: (await supabase.auth.getSession()).data.session,
        isAdmin,
        isAuthorized: isAuthorized || false,
        loading: false,
        plano: authData?.plano || null,
        dataExpiracao: authData?.data_expiracao || null,
      });
    } catch (error) {
      console.error('Erro ao verificar acesso:', error);
      setAuthState({
        user,
        session: (await supabase.auth.getSession()).data.session,
        isAdmin: false,
        isAuthorized: false,
        loading: false,
        plano: null,
        dataExpiracao: null,
      });
    }
  };

  const signUp = async (email: string, password: string, nome?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { nome }
      }
    });

    if (!error && data.user) {
      // Criar perfil
      await supabase.from('profiles').insert({
        user_id: data.user.id,
        email,
        nome
      });
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    return await supabase.auth.signOut();
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    refreshAccess: () => authState.user && checkUserAccess(authState.user),
  };
}
