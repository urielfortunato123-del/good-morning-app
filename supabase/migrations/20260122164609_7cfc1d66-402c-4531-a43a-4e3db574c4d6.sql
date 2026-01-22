-- Tabela para controlar uso diário por usuário
CREATE TABLE public.uso_diario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  geracoes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, data)
);

-- Enable RLS
ALTER TABLE public.uso_diario ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own usage" 
ON public.uso_diario 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
ON public.uso_diario 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" 
ON public.uso_diario 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_uso_diario_updated_at
BEFORE UPDATE ON public.uso_diario
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar coluna na tabela usuarios_autorizados para o plano e data de início
ALTER TABLE public.usuarios_autorizados 
ADD COLUMN IF NOT EXISTS data_inicio DATE DEFAULT CURRENT_DATE;