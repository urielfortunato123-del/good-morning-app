import { Sparkles, Moon, Sun } from "lucide-react";

const Header = () => {
  const now = new Date();
  const hour = now.getHours();
  const isNight = hour < 6 || hour >= 18;

  return (
    <header className="relative overflow-hidden border-b border-gold/20 bg-gradient-to-r from-card via-cosmic to-card">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-2 left-10 text-2xl animate-pulse">✧</div>
        <div className="absolute top-4 right-20 text-xl animate-pulse delay-100">✦</div>
        <div className="absolute bottom-2 left-1/3 text-lg animate-pulse delay-200">✧</div>
        <div className="absolute top-3 left-1/2 text-2xl animate-pulse delay-300">☆</div>
        <div className="absolute bottom-3 right-1/4 text-xl animate-pulse delay-500">✦</div>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-6 h-6 text-background" />
              </div>
              <div className="absolute -inset-1 bg-gold/20 rounded-full blur-md -z-10" />
            </div>
            <div>
              <h1 className="font-cinzel text-2xl md:text-3xl gold-text font-bold tracking-wider">
                Oráculo do Bicho
              </h1>
              <p className="text-muted-foreground text-sm font-cormorant italic">
                Sabedoria Mística & Análise Esotérica
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-gold/20">
              {isNight ? (
                <Moon className="w-4 h-4 text-gold" />
              ) : (
                <Sun className="w-4 h-4 text-gold" />
              )}
              <span className="text-sm text-muted-foreground font-cormorant">
                {now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    </header>
  );
};

export default Header;
