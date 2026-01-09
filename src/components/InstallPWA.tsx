import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, Monitor, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Check if iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallBanner(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isInstalled || !showInstallBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <div className="bg-card/95 backdrop-blur-lg border border-primary/30 rounded-xl p-4 shadow-lg">
        <button 
          onClick={() => setShowInstallBanner(false)}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Download className="h-6 w-6 text-primary" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-cinzel font-semibold text-foreground mb-1">
              Instalar Oráculo
            </h3>
            
            {isIOS ? (
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Para instalar no iPhone/iPad:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Toque no ícone de compartilhar <span className="inline-block">⬆️</span></li>
                  <li>Role e toque em "Adicionar à Tela Início"</li>
                  <li>Toque em "Adicionar"</li>
                </ol>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-3">
                  Instale o app para acesso rápido e uso offline!
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleInstall} 
                    size="sm" 
                    className="bg-primary text-primary-foreground gap-1"
                  >
                    <Smartphone className="h-4 w-4" />
                    Instalar
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <Monitor className="h-3 w-3" />
          <span>Funciona no celular e desktop</span>
        </div>
      </div>
    </div>
  );
};
