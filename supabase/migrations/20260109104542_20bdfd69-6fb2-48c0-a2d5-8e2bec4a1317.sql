-- Tabela para armazenar resultados históricos e aprendizado
CREATE TABLE public.resultados_historicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data DATE NOT NULL,
  horario TEXT NOT NULL,
  premio INTEGER NOT NULL,
  milhar TEXT NOT NULL,
  dezena TEXT NOT NULL,
  grupo INTEGER NOT NULL,
  animal TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para armazenar padrões aprendidos pela IA
CREATE TABLE public.padroes_aprendidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo TEXT NOT NULL, -- 'grupo', 'dezena', 'sequencia', 'horario'
  valor TEXT NOT NULL, -- o padrão identificado
  frequencia INTEGER NOT NULL DEFAULT 1,
  peso DECIMAL(5,2) NOT NULL DEFAULT 1.0,
  contexto JSONB DEFAULT '{}', -- informações adicionais do contexto
  ultima_ocorrencia DATE,
  taxa_acerto DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para previsões e verificação de acertos
CREATE TABLE public.previsoes_quanticas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  data_previsao DATE NOT NULL,
  horario TEXT NOT NULL,
  numeros TEXT[] NOT NULL,
  grupos INTEGER[] NOT NULL,
  confianca DECIMAL(5,2) NOT NULL,
  metodos_usados TEXT[] NOT NULL,
  explicacao_ia TEXT,
  acertou BOOLEAN DEFAULT NULL, -- NULL = não verificado, TRUE = acertou, FALSE = errou
  numero_acertado TEXT, -- qual número acertou, se houver
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para métricas de aprendizado
CREATE TABLE public.metricas_aprendizado (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_previsoes INTEGER NOT NULL DEFAULT 0,
  total_acertos INTEGER NOT NULL DEFAULT 0,
  taxa_acerto DECIMAL(5,2) NOT NULL DEFAULT 0,
  melhor_metodo TEXT,
  melhor_grupo INTEGER,
  melhor_horario TEXT,
  ultima_atualizacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir registro inicial de métricas
INSERT INTO public.metricas_aprendizado (total_previsoes, total_acertos, taxa_acerto) 
VALUES (0, 0, 0);

-- Habilitar RLS
ALTER TABLE public.resultados_historicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.padroes_aprendidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.previsoes_quanticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metricas_aprendizado ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (app sem autenticação por enquanto)
CREATE POLICY "Acesso público aos resultados" ON public.resultados_historicos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público aos padrões" ON public.padroes_aprendidos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público às previsões" ON public.previsoes_quanticas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público às métricas" ON public.metricas_aprendizado FOR ALL USING (true) WITH CHECK (true);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para padrões
CREATE TRIGGER update_padroes_updated_at
BEFORE UPDATE ON public.padroes_aprendidos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();