import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const DownloadAppButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSDialog, setShowIOSDialog] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSDialog(true);
      return;
    }

    if (!deferredPrompt) {
      // Mostrar dialog de instruções genéricas
      setShowIOSDialog(true);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    
    setDeferredPrompt(null);
  };

  if (isInstalled) return null;

  return (
    <>
      <Button
        onClick={handleInstall}
        className="w-full bg-gradient-to-r from-mystic-purple to-purple-600 hover:from-purple-600 hover:to-mystic-purple text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
        size="lg"
      >
        <Download className="w-5 h-5 mr-2" />
        Baixar App
        <Smartphone className="w-5 h-5 ml-2" />
      </Button>

      <Dialog open={showIOSDialog} onOpenChange={setShowIOSDialog}>
        <DialogContent className="bg-card border-gold/20">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-gold flex items-center gap-2">
              <Download className="w-5 h-5" />
              Instalar o Oráculo
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isIOS ? (
                <div className="space-y-4 mt-4">
                  <p className="font-cormorant text-base">
                    Para instalar no iPhone/iPad:
                  </p>
                  <ol className="list-decimal list-inside space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="bg-gold/10 px-2 py-1 rounded">1.</span>
                      <span>Toque no ícone de compartilhar <span className="text-lg">⬆️</span> na barra inferior do Safari</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-gold/10 px-2 py-1 rounded">2.</span>
                      <span>Role para baixo e toque em <strong>"Adicionar à Tela Início"</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-gold/10 px-2 py-1 rounded">3.</span>
                      <span>Toque em <strong>"Adicionar"</strong> no canto superior direito</span>
                    </li>
                  </ol>
                  <div className="p-3 bg-gold/10 rounded-lg border border-gold/20 mt-4">
                    <p className="text-xs text-gold">
                      💡 O app ficará na sua tela inicial como qualquer outro aplicativo!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  <p className="font-cormorant text-base">
                    Para instalar o app:
                  </p>
                  <ol className="list-decimal list-inside space-y-3 text-sm">
                    <li>Abra o menu do navegador (⋮ ou ⋯)</li>
                    <li>Procure por "Instalar app" ou "Adicionar à tela inicial"</li>
                    <li>Confirme a instalação</li>
                  </ol>
                  <div className="p-3 bg-gold/10 rounded-lg border border-gold/20 mt-4">
                    <p className="text-xs text-gold">
                      💡 Se não aparecer a opção, tente acessar pelo Chrome ou Edge!
                    </p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
