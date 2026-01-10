import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Loader2, Globe, Calendar, CloudUpload, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const UFS = ['RJ', 'SP', 'MG', 'BA', 'RS', 'PR', 'PE', 'CE', 'GO', 'PA'];

export const ImportarResultados = () => {
  const [uf, setUf] = useState('RJ');
  const [modo, setModo] = useState<'today' | 'single' | 'range'>('today');
  const [data, setData] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [resultados, setResultados] = useState<any[]>([]);
  const [salvosNoBanco, setSalvosNoBanco] = useState(false);

  const buscarResultados = async () => {
    setLoading(true);
    setSalvosNoBanco(false);
    try {
      let params = new URLSearchParams({ uf, mode: modo });
      
      if (modo === 'single' && data) {
        params.append('start', data);
      } else if (modo === 'range' && dataInicio && dataFim) {
        params.append('start', dataInicio);
        params.append('end', dataFim);
      }

      const url = `https://qtwfsoslzqghxpnjvowf.supabase.co/functions/v1/scrape-resultados?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao buscar resultados');
      }

      const result = await res.json();
      
      if (result.items && result.items.length > 0) {
        setResultados(result.items);
        toast.success(`${result.count} resultados encontrados!`);
      } else {
        toast.info('Nenhum resultado encontrado para esta data');
        setResultados([]);
      }
    } catch (err: any) {
      console.error('Erro:', err);
      toast.error(err.message || 'Erro ao buscar resultados');
    } finally {
      setLoading(false);
    }
  };

  const salvarNoBanco = async () => {
    if (resultados.length === 0) return;
    
    setSalvando(true);
    try {
      let params = new URLSearchParams({ uf, mode: modo, save: 'true' });
      
      if (modo === 'single' && data) {
        params.append('start', data);
      } else if (modo === 'range' && dataInicio && dataFim) {
        params.append('start', dataInicio);
        params.append('end', dataFim);
      }

      const url = `https://qtwfsoslzqghxpnjvowf.supabase.co/functions/v1/scrape-resultados?${params.toString()}`;
      const res = await fetch(url);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro ao salvar');
      }

      setSalvosNoBanco(true);
      toast.success(`${resultados.length} resultados salvos no banco! A IA agora pode aprender com esses dados.`);
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      toast.error(err.message || 'Erro ao salvar no banco');
    } finally {
      setSalvando(false);
    }
  };

  const exportarCSV = () => {
    if (resultados.length === 0) return;
    
    const header = ['data', 'uf', 'hora', 'extracao', 'premio', 'milhar', 'grupo', 'bicho'];
    const lines = [header.join(',')];
    
    resultados.forEach(r => {
      const line = header.map(k => r[k] ?? '').join(',');
      lines.push(line);
    });
    
    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultados_${uf}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-background/95 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-primary" />
            Importar Resultados para IA Aprender
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Importe dados históricos do site para o banco de dados. A IA usará esses dados para identificar padrões.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Estado (UF)</Label>
              <Select value={uf} onValueChange={setUf}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UFS.map(u => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Modo</Label>
              <Select value={modo} onValueChange={(v) => setModo(v as typeof modo)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="single">Data específica</SelectItem>
                  <SelectItem value="range">Intervalo (máx 30 dias)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {modo === 'single' && (
            <div>
              <Label>Data</Label>
              <Input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>
          )}

          {modo === 'range' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data Início</Label>
                <Input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div>
                <Label>Data Fim</Label>
                <Input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
            </div>
          )}

          <Button 
            onClick={buscarResultados} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Buscando no site...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Buscar Resultados
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {resultados.length > 0 && (
        <Card className="bg-gradient-to-br from-background/95 to-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-lg flex items-center gap-2">
                {resultados.length} Resultados Encontrados
                {salvosNoBanco && <CheckCircle className="h-5 w-5 text-green-500" />}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={exportarCSV}>
                  <Download className="h-4 w-4 mr-1" />
                  CSV
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={salvarNoBanco} 
              disabled={salvando || salvosNoBanco}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              {salvando ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando no banco...
                </>
              ) : salvosNoBanco ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Salvo! IA pode aprender
                </>
              ) : (
                <>
                  <CloudUpload className="h-4 w-4 mr-2" />
                  Salvar no Banco para IA Aprender
                </>
              )}
            </Button>

            <div className="max-h-64 overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b">
                    <th className="text-left p-2">Data</th>
                    <th className="text-left p-2">Hora</th>
                    <th className="text-left p-2">Prêmio</th>
                    <th className="text-left p-2">Milhar</th>
                    <th className="text-left p-2">Grupo</th>
                    <th className="text-left p-2">Bicho</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.slice(0, 50).map((r, i) => (
                    <tr key={i} className="border-b border-muted/20 hover:bg-muted/10">
                      <td className="p-2">{r.data}</td>
                      <td className="p-2">{r.hora}</td>
                      <td className="p-2">{r.premio}º</td>
                      <td className="p-2 font-mono font-bold">{r.milhar}</td>
                      <td className="p-2">{r.grupo}</td>
                      <td className="p-2">{r.bicho}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {resultados.length > 50 && (
                <p className="text-center text-muted-foreground text-sm mt-2">
                  Mostrando 50 de {resultados.length} resultados
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
