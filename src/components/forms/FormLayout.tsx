import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FormLayoutProps {
  title: string;
  step: number;
  totalSteps: number;
  onPrev: () => void;
  onNext?: () => void;
  isLastStep?: boolean;
  isLoading?: boolean;
  children: ReactNode;
  isValid?: boolean;
}

export function FormLayout({
  title,
  step,
  totalSteps,
  onPrev,
  onNext,
  isLastStep,
  isLoading,
  children,
  isValid = true,
}: FormLayoutProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background pb-32 font-inter transition-colors duration-300">
      <header className="bg-card border-b border-border sticky top-0 z-30">
        <div className="px-6 py-4 flex items-center justify-between">
          <button 
            onClick={onPrev}
            className="w-10 h-10 flex items-center justify-center bg-muted rounded-xl text-primary active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold text-foreground uppercase tracking-widest">
              {title}
            </h1>
            <p className="text-[10px] text-muted-foreground font-bold">Passo {step} de {totalSteps}</p>
          </div>
          <div className="w-10" />
        </div>
        <div className="h-1.5 w-full bg-muted overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      <main className="px-6 pt-8 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-card/80 backdrop-blur-xl border-t border-border z-40">
        <div className="max-w-lg mx-auto">
          {!isLastStep ? (
            <button 
              type="button"
              onClick={onNext}
              className="w-full h-16 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-50"
              disabled={!isValid}
            >
              PRÓXIMO PASSO <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              type="submit"
              disabled={isLoading || !isValid}
              className="w-full h-16 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-50"
            >
              {isLoading ? "ENVIANDO..." : "FINALIZAR E ENVIAR"} <Check className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
