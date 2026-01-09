import { useMemo } from "react";
import Header from "@/components/Header";
import MysticBackground from "@/components/MysticBackground";
import { useResultadosHistoricos } from "@/hooks/useResultadosHistoricos";
import { GRUPOS_QUENTES, FREQUENCIA_POR_HORARIO } from "@/data/historicalData";
import { ANIMAIS } from "@/data/bichoData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Clock, Target, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CORES = [
  "#D4AF37", "#C9A227", "#F5D061", "#8B7355", "#B8860B",
  "#A855F7", "#9333EA", "#7C3AED", "#6366F1", "#4F46E5"
];

const Dashboard = () => {
  const { resultados, getEstatisticas } = useResultadosHistoricos();
  const stats = getEstatisticas();

  // Combinar dados fixos com cadastros manuais
  const dadosFrequencia = useMemo(() => {
    const combinado: Record<number, number> = {};
    
    // Dados históricos fixos
    GRUPOS_QUENTES.forEach(g => {
      combinado[g.grupo] = (combinado[g.grupo] || 0) + g.frequencia;
    });
    
    // Dados cadastrados manualmente
    Object.entries(stats.frequenciaGrupos).forEach(([grupo, freq]) => {
      combinado[parseInt(grupo)] = (combinado[parseInt(grupo)] || 0) + freq;
    });

    return Object.entries(combinado)
      .map(([grupo, frequencia]) => ({
        grupo: parseInt(grupo),
        nome: ANIMAIS.find(a => a.grupo === parseInt(grupo))?.nome || "?",
        frequencia
      }))
      .sort((a, b) => b.frequencia - a.frequencia)
      .slice(0, 15);
  }, [stats]);

  // Dados por horário
  const dadosPorHorario = useMemo(() => {
    const horarios = ["09h", "11h", "14h", "16h", "18h", "21h"];
    return horarios.map(h => {
      const freqFixa = FREQUENCIA_POR_HORARIO[h] || {};
      const freqManual = stats.frequenciaPorHorario[h] || {};
      const total = Object.values(freqFixa).reduce((a, b) => a + b, 0) +
                   Object.values(freqManual).reduce((a, b) => a + b, 0);
      return { horario: h, total };
    });
  }, [stats]);

  // Top 5 grupos quentes
  const topGrupos = dadosFrequencia.slice(0, 5);

  // Dados para pie chart
  const pieData = topGrupos.map((g, i) => ({
    name: g.nome,
    value: g.frequencia,
    color: CORES[i]
  }));

  return (
    <div className="min-h-screen relative">
      <MysticBackground />
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-cinzel text-2xl text-gold mb-2">📊 Dashboard Estatístico</h1>
              <p className="font-cormorant text-muted-foreground">
                Análise combinada: dados históricos + {resultados.length} cadastros manuais
              </p>
            </div>
            <Link to="/">
              <Button variant="outline" className="border-gold/20 hover:bg-gold/10">
                ← Voltar ao Oráculo
              </Button>
            </Link>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-card/50 border border-gold/10">
              <div className="flex items-center gap-2 text-gold mb-2">
                <Flame className="w-5 h-5" />
                <span className="font-cinzel text-sm">Mais Quente</span>
              </div>
              <p className="font-cinzel text-2xl text-gold">{topGrupos[0]?.nome}</p>
              <p className="text-xs text-muted-foreground">{topGrupos[0]?.frequencia}x aparições</p>
            </div>
            
            <div className="p-4 rounded-xl bg-card/50 border border-gold/10">
              <div className="flex items-center gap-2 text-mystic-purple mb-2">
                <Target className="w-5 h-5" />
                <span className="font-cinzel text-sm">2º Lugar</span>
              </div>
              <p className="font-cinzel text-2xl text-mystic-purple">{topGrupos[1]?.nome}</p>
              <p className="text-xs text-muted-foreground">{topGrupos[1]?.frequencia}x aparições</p>
            </div>
            
            <div className="p-4 rounded-xl bg-card/50 border border-gold/10">
              <div className="flex items-center gap-2 text-orange-400 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-cinzel text-sm">3º Lugar</span>
              </div>
              <p className="font-cinzel text-2xl text-orange-400">{topGrupos[2]?.nome}</p>
              <p className="text-xs text-muted-foreground">{topGrupos[2]?.frequencia}x aparições</p>
            </div>
            
            <div className="p-4 rounded-xl bg-card/50 border border-gold/10">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-5 h-5" />
                <span className="font-cinzel text-sm">Cadastros</span>
              </div>
              <p className="font-cinzel text-2xl">{resultados.length}</p>
              <p className="text-xs text-muted-foreground">resultados manuais</p>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Frequência de Grupos */}
            <div className="p-6 rounded-2xl bg-card/50 border border-gold/10">
              <h3 className="font-cinzel text-lg text-gold mb-4">🔥 Frequência por Grupo</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosFrequencia} layout="vertical">
                  <XAxis type="number" stroke="#666" fontSize={12} />
                  <YAxis type="category" dataKey="nome" stroke="#666" fontSize={11} width={70} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--gold) / 0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="frequencia" fill="#D4AF37" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Distribuição */}
            <div className="p-6 rounded-2xl bg-card/50 border border-gold/10">
              <h3 className="font-cinzel text-lg text-gold mb-4">🎯 Top 5 Grupos</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Por Horário */}
            <div className="p-6 rounded-2xl bg-card/50 border border-gold/10 lg:col-span-2">
              <h3 className="font-cinzel text-lg text-gold mb-4">⏰ Resultados por Horário</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dadosPorHorario}>
                  <XAxis dataKey="horario" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--gold) / 0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#A855F7" 
                    strokeWidth={3}
                    dot={{ fill: '#A855F7', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tabela de Grupos Quentes */}
          <div className="p-6 rounded-2xl bg-card/50 border border-gold/10">
            <h3 className="font-cinzel text-lg text-gold mb-4">📋 Ranking Completo</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {dadosFrequencia.map((g, i) => (
                <div 
                  key={g.grupo}
                  className={`p-3 rounded-lg border ${
                    i === 0 ? 'bg-red-500/10 border-red-500/30' :
                    i < 3 ? 'bg-orange-500/10 border-orange-500/30' :
                    i < 5 ? 'bg-yellow-500/10 border-yellow-500/30' :
                    'bg-muted/30 border-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">#{i + 1}</span>
                    <span className="text-xs">
                      {i === 0 ? '🔥🔥🔥' : i < 3 ? '🔥🔥' : i < 5 ? '🔥' : ''}
                    </span>
                  </div>
                  <p className="font-cinzel text-sm mt-1">{g.nome}</p>
                  <p className="text-xs text-muted-foreground">{g.frequencia}x</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
