import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICE_TYPES } from "../lib/utils";
import { Chatbot } from "../components/Chatbot";


export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'welcome' | 'services' | 'chatbot'>('welcome');
  const [isLoaded, setIsLoaded] = useState(false);

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
    navigate({
      to: "/atendimento",
      search: {
        tipo: serviceId,
        cliente: isClient ? 'sim' : 'nao'
      }
    });
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/5514981200302", "_blank");
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
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-inter overflow-x-hidden">

      {/* Hero Banner Section (35% height approx) */}
      <section className="relative h-[42vh] overflow-hidden">
        {/* Modern Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#003B73] via-[#0077B6] to-[#00B4D8]" />
        
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />

        <div className="relative z-10 h-full flex flex-col px-6 pt-12">
          {/* Logo and Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
               <img 
                src="https://res.cloudinary.com/dcii6r5op/image/upload/v1780513779/promaxx/brm9x7wmlgi4r2oizt7i.png" 
                alt="Acqua Soft Logo" 
                className="h-8 w-auto brightness-0 invert" 
              />
            </div>
            <div>
              <h2 className="text-white font-bold tracking-tight text-xl leading-none">ACQUA SOFT</h2>
              <span className="text-blue-100/80 text-[10px] uppercase font-bold tracking-[0.2em]">Connect</span>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-[80%]"
          >
            <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
              ACQUA SOFT CONNECT
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed font-medium">
              Solicite suporte, manutenção ou orçamento em poucos minutos.
            </p>
          </motion.div>

          {/* Purifier Image Replacement/Overlay */}
          <div className="absolute right-[-20px] bottom-4 w-48 opacity-40 mix-blend-overlay">
            <Droplet className="w-full h-full text-white" strokeWidth={0.5} />
          </div>
        </div>
      </section>

      {/* Trust Badges - Glassmorphism Style */}
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
              className="bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-white/50 flex flex-col gap-2"
            >
              <badge.icon className={`w-6 h-6 ${badge.color}`} />
              <span className="text-xs font-bold text-[#003B73] leading-tight">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Main Action Menu */}
      <section className="px-6 mt-8">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 ml-1">Como podemos ajudar?</h3>
        <div className="grid gap-4">
          {/* Card 1 - Já sou cliente */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('services')}
            className="group relative overflow-hidden bg-white p-6 rounded-[2rem] shadow-lg shadow-gray-200/50 border border-gray-100 text-left"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#003B73]">
                  <Wrench className="w-5 h-5" />
                  <span className="font-extrabold text-lg">JÁ POSSUO UM PURIFICADOR</span>
                </div>
                <p className="text-gray-500 text-sm font-medium">Suporte técnico, troca de refil e manutenção.</p>
                <div className="pt-2 flex items-center gap-2 text-[#0077B6] font-bold text-sm">
                  Acessar <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] rotate-12">
              <Wrench className="w-32 h-32" />
            </div>
          </motion.button>

          {/* Card 2 - Quero um purificador */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleServiceSelect('orcamento', false)}
            className="group relative overflow-hidden bg-white p-6 rounded-[2rem] shadow-lg shadow-gray-200/50 border border-gray-100 text-left"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#0077B6]">
                  <Droplet className="w-5 h-5" />
                  <span className="font-extrabold text-lg uppercase">Quero um purificador</span>
                </div>
                <p className="text-gray-500 text-sm font-medium">Solicite orçamento e instalação profissional.</p>
                <div className="pt-2 flex items-center gap-2 text-[#00B4D8] font-bold text-sm">
                  Solicitar <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] rotate-12">
              <Droplet className="w-32 h-32" />
            </div>
          </motion.button>
        </div>
      </section>

      {/* Featured Services Grid */}
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
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleServiceSelect(service.id, true)}
                  className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-3 text-left"
                >
                  <div className={`w-10 h-10 rounded-2xl bg-${service.color}-50 flex items-center justify-center text-${service.color}-600`}>
                    <service.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{service.label}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{service.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="px-6 mt-12 mb-8 space-y-6">
        <div className="h-px bg-gray-200 w-full" />
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <MapPin className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xs text-gray-500">
              <p className="font-bold text-gray-700">Rua Tenente Lopes, 1175</p>
              <p>Centro - Jaú/SP</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <MessageCircle className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-xs text-gray-500">
              <p className="font-bold text-gray-700">(14) 98120-0302</p>
              <p>Acqua Soft Purificadores</p>
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-gray-300 font-medium">© 2026 Acqua Soft Atendimento • v2.0</p>
        <motion.p 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-center text-[10px] text-blue-500 font-bold uppercase tracking-widest"
        >
          Desenvolvido por Uriel da Fonseca Fortunato
        </motion.p>

      </footer>

      {/* Floating WhatsApp Button */}
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