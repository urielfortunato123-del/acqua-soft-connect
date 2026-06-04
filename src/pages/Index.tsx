import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  User, 
  UserPlus, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Wrench, 
  Droplet, 
  ClipboardList, 
  MessageCircle,
  MapPin,
  ChevronRight,
  ArrowRight,
  Download,
  Moon,
  Sun
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { Chatbot } from "../components/Chatbot";
import { PWAInstallPrompt } from "../components/PWAInstallPrompt";
import { ShareButton } from "../components/ShareButton";

export default function Index() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'welcome' | 'services' | 'chatbot'>('welcome');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    // Haptic feedback se disponível
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  };


  useEffect(() => {
    setIsLoaded(true);
  }, []);


  const trustBadges = [
    { icon: Zap, label: "Atendimento Rápido", color: "text-blue-400" },
    { icon: Wrench, label: "Técnicos Especializados", color: "text-blue-300" },
    { icon: Droplet, label: "Instalação Profissional", color: "text-blue-200" },
    { icon: MapPin, label: "Jaú e Região", color: "text-blue-100" },
  ];

  const services = [
    { id: 'suporte', label: 'Suporte Técnico', icon: Wrench, description: 'Problemas técnicos', color: 'blue' },
    { id: 'refil', label: 'Troca de Refil', icon: Droplet, description: 'Manutenção de filtros', color: 'cyan' },
    { id: 'orcamento', label: 'Solicitar Orçamento', icon: ClipboardList, description: 'Novos purificadores', color: 'indigo' },
    { id: 'manutencao', label: 'Mnt. Preventiva', icon: ShieldCheck, description: 'Limpeza e revisão', color: 'sky' },
  ];

  const handleServiceSelect = (serviceId: string, isClient: boolean) => {
    navigate(`/atendimento?tipo=${serviceId}&cliente=${isClient ? 'sim' : 'nao'}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (activeTab === 'chatbot') {
    return <Chatbot onBack={() => setActiveTab('welcome')} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-inter overflow-x-hidden transition-colors duration-500">
      <PWAInstallPrompt />
      <ShareButton />

      <section className="relative h-[45vh] overflow-hidden">
        <motion.div 
          animate={{ 
            background: isDarkMode 
              ? ["linear-gradient(to bottom right, #0F172A, #1E293B, #0F172A)"] 
              : ["linear-gradient(to bottom right, #003B73, #0077B6, #00B4D8)"]
          }}
          className="absolute inset-0 animate-gradient" 
        />
        
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />

        <div className="relative z-10 h-full flex flex-col px-6 pt-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-white dark:bg-slate-800 p-1 rounded-xl shadow-lg border border-white/20">
                <img 
                  src="https://res.cloudinary.com/dcii6r5op/image/upload/v1780573444/promaxx/phxku1jfhtzl6g0wl748.png" 
                  alt="Acqua Soft Logo" 
                  className="h-12 w-12 object-contain" 
                />
              </div>
              <div>
                <h2 className="text-white font-black tracking-tight text-xl leading-none">ACQUA SOFT</h2>
                <span className="text-blue-100/80 text-[10px] uppercase font-bold tracking-[0.2em]">Connect</span>
              </div>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-[85%]"
          >
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
              ACQUA SOFT CONNECT
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed font-medium">
              Solicite suporte, manutenção ou orçamento em poucos minutos.
            </p>
          </motion.div>

          <div className="absolute right-[-20px] bottom-4 w-48 opacity-20 mix-blend-overlay">
            <Droplet className="w-full h-full text-white" strokeWidth={0.5} />
          </div>
        </div>
      </section>

      <div className="px-6 -mt-10 relative z-20">


        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 gap-3"
        >
          {trustBadges.map((badge, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass p-4 rounded-2xl flex flex-col gap-2 transition-all duration-300"
            >
              <badge.icon className={cn("w-6 h-6", badge.color)} />
              <span className="text-xs font-bold text-primary dark:text-blue-200 leading-tight">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <section className="px-6 mt-8">
        <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4 ml-1">Como podemos ajudar?</h3>
        <div className="grid gap-4">
          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('services')}
            className="group relative overflow-hidden glass p-6 rounded-[2rem] text-left transition-all duration-300"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary dark:text-blue-300">
                  <Wrench className="w-5 h-5" />
                  <span className="font-extrabold text-lg">JÁ POSSUO UM PURIFICADOR</span>
                </div>
                <p className="text-muted-foreground text-sm font-medium">Suporte técnico, troca de refil e manutenção.</p>
                <div className="pt-2 flex items-center gap-2 text-secondary dark:text-blue-400 font-bold text-sm">
                  Acessar <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] dark:opacity-[0.05] rotate-12 transition-transform group-hover:scale-110">
              <Wrench className="w-32 h-32" />
            </div>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleServiceSelect('orcamento', false)}
            className="group relative overflow-hidden glass p-6 rounded-[2rem] text-left transition-all duration-300"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary dark:text-blue-400">
                  <Droplet className="w-5 h-5" />
                  <span className="font-extrabold text-lg uppercase">Quero um purificador</span>
                </div>
                <p className="text-muted-foreground text-sm font-medium">Solicite orçamento e instalação profissional.</p>
                <div className="pt-2 flex items-center gap-2 text-blue-400 dark:text-blue-500 font-bold text-sm">
                  Solicitar <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] dark:opacity-[0.05] rotate-12 transition-transform group-hover:scale-110">
              <Droplet className="w-32 h-32" />
            </div>
          </motion.button>
        </div>
      </section>

      <AnimatePresence>
        {activeTab === 'services' && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 mt-10 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Serviços em Destaque</h3>
              <button onClick={() => setActiveTab('welcome')} className="text-blue-500 text-xs font-bold">Ver menos</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {services.map((service) => (
                <motion.button
                  key={service.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleServiceSelect(service.id, true)}
                  className="glass p-5 rounded-3xl flex flex-col gap-3 text-left transition-all duration-300"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center",
                    `bg-${service.color}-50 dark:bg-${service.color}-900/20 text-${service.color}-600 dark:text-${service.color}-400`
                  )}>
                    <service.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm leading-tight">{service.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{service.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="px-6 mt-12 mb-8 space-y-6">
        <div className="h-px bg-border w-full" />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="glass p-2 rounded-xl">
              <MapPin className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-bold text-foreground">Rua Tenente Lopes, 1175</p>
              <p>Centro - Jaú/SP</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass p-2 rounded-xl">
              <MessageCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-bold text-foreground">(14) 98120-0302</p>
              <p>vendas@acquasoftjau.com.br</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass p-2 rounded-xl">
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-bold text-foreground">Horário de Atendimento</p>
              <p>Segunda a Sexta: 08:00 às 18:00</p>
              <p>Sábado: 08:00 às 12:00</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass p-2 rounded-xl">
              <ClipboardList className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-bold text-foreground">Visite nosso site</p>
              <a href="https://www.acquasoftpurificadores.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">www.acquasoftpurificadores.com</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass p-2 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-xs text-muted-foreground">
              <p className="font-bold text-foreground">CNPJ</p>
              <p>44.385.457/0001-38</p>
            </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-300 font-medium">© 2026 Acqua Soft Atendimento • v2.0</p>
        <motion.a 
          href="https://wa.me/5515996969953?text=Olá,%20gostaria%20de%20fazer%20um%20orçamento%20de%20aplicativo."
          target="_blank"
          rel="noopener noreferrer"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="block text-center text-[10px] text-blue-500 font-bold uppercase tracking-widest hover:text-blue-600 transition-colors"
        >
          Desenvolvido por Uriel da Fonseca Fortunato
        </motion.a>
      </footer>

      <motion.button 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setActiveTab('chatbot')}
        className="fixed bottom-6 right-6 w-16 h-16 bg-[#075E54] text-white rounded-full shadow-2xl flex items-center justify-center z-50 border-4 border-white"
      >
        <MessageCircle className="w-8 h-8 fill-current" />
      </motion.button>
    </div>
  );
}
