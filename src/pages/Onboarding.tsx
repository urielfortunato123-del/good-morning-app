import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Brain, 
  Trophy, 
  BookOpen, 
  ChevronRight, 
  ChevronLeft,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";
import MysticBackground from "@/components/MysticBackground";

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  tip?: string;
}

const steps: OnboardingStep[] = [
  {
    icon: <Sparkles className="h-16 w-16 text-primary" />,
    title: "Bem-vindo ao Oráculo do Bicho",
    description: "Um sistema de inteligência quântica que analisa padrões e aprende com resultados para gerar previsões cada vez mais precisas.",
    tip: "Quanto mais você usar, mais inteligente o sistema fica!"
  },
  {
    icon: <Brain className="h-16 w-16 text-purple-400" />,
    title: "Inteligência Quântica",
    description: "Nossa IA analisa milhares de padrões históricos, frequências, ciclos e correlações para identificar os números mais prováveis.",
    tip: "Acesse a aba '🧠 IA' para ver as métricas de aprendizado em tempo real."
  },
  {
    icon: <Zap className="h-16 w-16 text-yellow-400" />,
    title: "Canal Magnético",
    description: "Na aba '🔮 Oráculo', selecione o horário e método de análise desejado. O sistema combina múltiplas técnicas para gerar os melhores números.",
    tip: "Experimente diferentes métodos para encontrar o que funciona melhor para você."
  },
  {
    icon: <BookOpen className="h-16 w-16 text-amber-400" />,
    title: "São Cipriano",
    description: "Use o método tradicional do Livro de São Cipriano na aba '📖 Cipriano'. Informe seu nome e data de nascimento para uma análise personalizada.",
    tip: "Este método místico é baseado em tradições centenárias."
  },
  {
    icon: <Target className="h-16 w-16 text-green-400" />,
    title: "Registre Resultados",
    description: "Na aba '📝 Cadastrar', registre os resultados oficiais. Isso alimenta a IA e melhora as previsões futuras.",
    tip: "Quanto mais resultados você registrar, mais inteligente o sistema fica!"
  },
  {
    icon: <Trophy className="h-16 w-16 text-primary" />,
    title: "Marque seus Acertos",
    description: "Quando acertar, marque na aba '🏆 Acertos'. O sistema aprende com seus acertos para priorizar grupos e métodos vencedores.",
    tip: "Seus acertos influenciam diretamente as análises futuras!"
  },
  {
    icon: <TrendingUp className="h-16 w-16 text-emerald-400" />,
    title: "Pronto para Começar!",
    description: "Agora você conhece todas as funcionalidades. Lembre-se: o sistema melhora a cada uso. Boa sorte!",
    tip: "Instale o app na sua tela inicial para acesso rápido offline!"
  }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    navigate("/");
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding_completed", "true");
    navigate("/");
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <MysticBackground />
      
      {/* Skip button */}
      <div className="absolute top-4 right-4 z-20">
        <Button 
          variant="ghost" 
          onClick={handleSkip}
          className="text-muted-foreground hover:text-foreground"
        >
          Pular
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Progress dots */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? "w-8 bg-primary" 
                  : index < currentStep 
                    ? "w-2 bg-primary/50" 
                    : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-6 rounded-full bg-card/50 border border-primary/20 backdrop-blur-sm animate-pulse-glow">
              {step.icon}
            </div>
          </div>

          {/* Title */}
          <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-foreground">
            {step.title}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground text-lg leading-relaxed">
            {step.description}
          </p>

          {/* Tip */}
          {step.tip && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mt-4">
              <p className="text-sm text-primary flex items-center gap-2 justify-center">
                <Sparkles className="h-4 w-4" />
                {step.tip}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 relative z-10">
        <div className="max-w-md mx-auto flex gap-3">
          {currentStep > 0 && (
            <Button 
              variant="outline" 
              onClick={handlePrev}
              className="flex-1 border-primary/30 hover:bg-primary/10"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
          )}
          
          <Button 
            onClick={handleNext}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLastStep ? (
              <>
                Começar
                <Sparkles className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>

        {/* Step counter */}
        <p className="text-center text-muted-foreground text-sm mt-4">
          {currentStep + 1} de {steps.length}
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
