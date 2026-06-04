import { TechnicalSupportForm } from "../components/forms/TechnicalSupportForm";
import { FilterReplacementForm } from "../components/forms/FilterReplacementForm";
import { RequestQuoteForm } from "../components/forms/RequestQuoteForm";
import { PreventiveMaintenanceForm } from "../components/forms/PreventiveMaintenanceForm";
import { ShareButton } from "../components/ShareButton";
import { useTheme } from "../hooks/use-theme";
import { Moon, Sun, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface AtendimentoProps {
  tipo: string;
  cliente: string;
}

export default function Atendimento({ tipo }: AtendimentoProps) {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();

  const renderForm = () => {
    switch (tipo) {
      case 'suporte':
        return <TechnicalSupportForm />;
      case 'refil':
        return <FilterReplacementForm />;
      case 'orcamento':
        return <RequestQuoteForm />;
      case 'manutencao':
        return <PreventiveMaintenanceForm />;
      default:
        return <TechnicalSupportForm />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <ShareButton />
      
      {/* Botão de Tema Fixo */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="p-3 rounded-full bg-primary/10 dark:bg-white/10 backdrop-blur-md border border-primary/20 dark:border-white/20 text-primary dark:text-white shadow-lg fixed top-20 right-4 z-[9998]"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </motion.button>

      {/* Botão de Voltar */}
      <div className="px-6 pt-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Início
        </button>
      </div>

      <div className="pb-12">
        {renderForm()}
      </div>
    </div>
  );
}
