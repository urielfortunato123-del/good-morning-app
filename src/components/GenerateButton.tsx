import { cn } from "@/lib/utils";
import { Sparkles, Loader2 } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

const GenerateButton = ({ onClick, disabled, loading }: GenerateButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "group relative w-full py-4 px-8 rounded-xl font-cinzel text-lg uppercase tracking-widest",
        "transition-all duration-500 transform",
        "overflow-hidden",
        disabled
          ? "bg-muted text-muted-foreground cursor-not-allowed"
          : "bg-gradient-to-r from-gold-dark via-gold to-gold-dark text-background hover:scale-[1.02] hover:shadow-[0_0_40px_hsl(45_80%_55%/0.4)] active:scale-[0.98]"
      )}
    >
      {/* Shimmer effect */}
      {!disabled && !loading && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-3">
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Consultando os Astros...</span>
          </>
        ) : (
          <>
            <Sparkles className={cn(
              "w-5 h-5 transition-transform",
              !disabled && "group-hover:rotate-12"
            )} />
            <span>Revelar Números</span>
            <Sparkles className={cn(
              "w-5 h-5 transition-transform",
              !disabled && "group-hover:-rotate-12"
            )} />
          </>
        )}
      </span>

      {/* Glow effect */}
      {!disabled && (
        <div className="absolute -inset-1 bg-gold/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
      )}
    </button>
  );
};

export default GenerateButton;
