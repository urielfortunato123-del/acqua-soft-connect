import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  ChevronLeft, 
  MessageCircle, 
  Droplet, 
  Wrench, 
  ShieldCheck, 
  ClipboardList, 
  MapPin,
  CheckCircle2,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";
import { useTheme } from "../hooks/use-theme";

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string | React.ReactNode;
  timestamp: Date;
  isTyping?: boolean;
}

interface Step {
  id: string;
  message: string | string[];
  options?: Array<{
    label: string;
    icon?: any;
    value: string;
    nextStep?: string;
    action?: () => void;
  }>;
  inputType?: 'text' | 'tel';
  placeholder?: string;
  nextStep?: string;
}

const TypingIndicator = () => (
  <div className="flex gap-1 p-2">
    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
  </div>
);

export function Chatbot({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [currentStepId, setCurrentStepId] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [collectedData, setCollectedData] = useState<Record<string, string>>({});
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isBotTyping]);

  const addBotMessages = async (stepId: string) => {
    const step = steps[stepId];
    if (!step) return;

    setIsBotTyping(true);
    setShowOptions(false);
    
    const messageList = Array.isArray(step.message) ? step.message : [step.message];
    
    for (const content of messageList) {
      if (!content && stepId === 'welcome') continue; // Allow empty first message if it leads to options
      if (!content && step.options) break; 

      const delay = Math.min(Math.max(content.length * 20, 500), 1500);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      setMessages(prev => [...prev, {
        id: Math.random().toString(),
        type: 'bot',
        content,
        timestamp: new Date()
      }]);
    }

    setIsBotTyping(false);
    setCurrentStepId(stepId);
    
    setTimeout(() => {
      setShowOptions(true);
    }, 400);
  };

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      addBotMessages('welcome');
    }
  }, []);

  const steps: Record<string, Step> = {
    welcome: {
      id: 'welcome',
      message: [
        "Olá! Seja bem-vindo à Acqua Soft. Sou sua assistente virtual e vou ajudá-lo a encontrar a melhor solução.",
        "Como podemos ajudar você hoje?"
      ],
      options: [
        { label: "Suporte Técnico", icon: Wrench, value: "suporte", nextStep: "support_name" },
        { label: "Troca de Refil", icon: Droplet, value: "refil", nextStep: "refil_name" },
        { label: "Solicitar Orçamento", icon: ClipboardList, value: "comprar", nextStep: "quote_name" },
        { label: "Manutenção Preventiva", icon: ShieldCheck, value: "manutencao", nextStep: "maint_name" },
        { label: "Falar com Atendente", icon: MessageCircle, value: "atendente", action: () => window.open(`https://wa.me/5514981200302?text=${encodeURIComponent("Olá, gostaria de falar com um atendente.")}`, "_blank") },
      ]
    },
    // Support Flow
    support_name: {
      id: 'support_name',
      message: "Qual é o seu nome completo?",
      inputType: 'text',
      placeholder: "Digite seu nome...",
      nextStep: "support_whatsapp"
    },
    support_whatsapp: {
      id: 'support_whatsapp',
      message: "Qual o seu WhatsApp para contato?",
      inputType: 'tel',
      placeholder: "(14) 99999-9999",
      nextStep: "support_city"
    },
    support_city: {
      id: 'support_city',
      message: "Em qual cidade você está?",
      inputType: 'text',
      placeholder: "Digite sua cidade...",
      nextStep: "support_neighborhood"
    },
    support_neighborhood: {
      id: 'support_neighborhood',
      message: "E qual o seu bairro?",
      inputType: 'text',
      placeholder: "Digite seu bairro...",
      nextStep: "support_model"
    },
    support_model: {
      id: 'support_model',
      message: "Qual o modelo do seu purificador?",
      options: [
        { label: "Soft Baby", value: "Soft Baby", nextStep: "support_desc" },
        { label: "Soft Fit", value: "Soft Fit", nextStep: "support_desc" },
        { label: "Soft Slim", value: "Soft Slim", nextStep: "support_desc" },
        { label: "Soft Everest", value: "Soft Everest", nextStep: "support_desc" },
        { label: "Outro", value: "Outro", nextStep: "support_desc" },
      ]
    },
    support_desc: {
      id: 'support_desc',
      message: "Poderia descrever brevemente o problema?",
      inputType: 'text',
      placeholder: "Ex: Não está gelando...",
      nextStep: "support_finish"
    },
    support_finish: {
      id: 'support_finish',
      message: ["Certo.", "Vou encaminhar seus dados para nossos técnicos agora."],
      options: [
        { label: "Finalizar no WhatsApp", value: "finish", action: () => finishFlow("SUPORTE TÉCNICO") }
      ]
    },
    // Quote Flow
    quote_name: {
      id: 'quote_name',
      message: "Excelente escolha! Qual é o seu nome?",
      inputType: 'text',
      placeholder: "Digite seu nome...",
      nextStep: "quote_whatsapp"
    },
    quote_whatsapp: {
      id: 'quote_whatsapp',
      message: "Qual o seu WhatsApp?",
      inputType: 'tel',
      placeholder: "(14) 99999-9999",
      nextStep: "quote_city"
    },
    quote_city: {
      id: 'quote_city',
      message: "Em qual cidade o purificador será instalado?",
      inputType: 'text',
      placeholder: "Digite sua cidade...",
      nextStep: "quote_people"
    },
    quote_people: {
      id: 'quote_people',
      message: "Para quantas pessoas seria o purificador?",
      options: [
        { label: "1 a 2", value: "1-2", nextStep: "quote_interest" },
        { label: "3 a 4", value: "3-4", nextStep: "quote_interest" },
        { label: "5 a 6", value: "5-6", nextStep: "quote_interest" },
        { label: "Mais de 6", value: "6+", nextStep: "quote_interest" },
      ]
    },
    quote_interest: {
      id: 'quote_interest',
      message: "Qual sua preferência de água?",
      options: [
        { label: "Gelada e Natural", value: "Gelada/Natural", nextStep: "quote_finish" },
        { label: "Apenas Natural", value: "Natural", nextStep: "quote_finish" },
        { label: "Não sei escolher", value: "Nao Sei", nextStep: "quote_finish" },
      ]
    },
    quote_finish: {
      id: 'quote_finish',
      message: ["Ótimo!", "Vou te encaminhar para nossa equipe comercial agora mesmo."],
      options: [
        { label: "Solicitar Orçamento no WhatsApp", value: "finish", action: () => finishFlow("SOLICITAR ORÇAMENTO") }
      ]
    },
    // Refill Flow
    refil_name: {
      id: 'refil_name',
      message: "Trocar o refil garante a pureza da sua água. Qual seu nome?",
      inputType: 'text',
      placeholder: "Digite seu nome...",
      nextStep: "refil_whatsapp"
    },
    refil_whatsapp: {
      id: 'refil_whatsapp',
      message: "Qual seu WhatsApp?",
      inputType: 'tel',
      placeholder: "(14) 99999-9999",
      nextStep: "refil_model"
    },
    refil_model: {
      id: 'refil_model',
      message: "Qual o modelo do seu purificador?",
      options: [
        { label: "Soft Baby", value: "Soft Baby", nextStep: "refil_finish" },
        { label: "Soft Fit", value: "Soft Fit", nextStep: "refil_finish" },
        { label: "Soft Slim", value: "Soft Slim", nextStep: "refil_finish" },
        { label: "Soft Everest", value: "Soft Everest", nextStep: "refil_finish" },
        { label: "Outro", value: "Outro", nextStep: "refil_finish" },
      ]
    },
    refil_finish: {
      id: 'refil_finish',
      message: ["Excelente.", "Vou te passar os modelos e valores no WhatsApp."],
      options: [
        { label: "Pedir Refil no WhatsApp", value: "finish", action: () => finishFlow("TROCA DE REFIL") }
      ]
    },
    // Maint Flow
    maint_name: {
      id: 'maint_name',
      message: "Manutenção em dia é saúde! Qual seu nome?",
      inputType: 'text',
      placeholder: "Digite seu nome...",
      nextStep: "maint_whatsapp"
    },
    maint_whatsapp: {
      id: 'maint_whatsapp',
      message: "Informe seu WhatsApp para agendarmos.",
      inputType: 'tel',
      placeholder: "(14) 99999-9999",
      nextStep: "maint_model"
    },
    maint_model: {
      id: 'maint_model',
      message: "Qual o modelo do seu purificador?",
      options: [
        { label: "Soft Baby", value: "Soft Baby", nextStep: "maint_finish" },
        { label: "Soft Fit", value: "Soft Fit", nextStep: "maint_finish" },
        { label: "Soft Slim", value: "Soft Slim", nextStep: "maint_finish" },
        { label: "Soft Everest", value: "Soft Everest", nextStep: "maint_finish" },
        { label: "Outro", value: "Outro", nextStep: "maint_finish" },
      ]
    },
    maint_finish: {
      id: 'maint_finish',
      message: ["Tudo pronto.", "Vamos agendar agora via WhatsApp."],
      options: [
        { label: "Agendar Manutenção no WhatsApp", value: "finish", action: () => finishFlow("MANUTENÇÃO PREVENTIVA") }
      ]
    },
  };

  const finishFlow = (type: string) => {
    let text = `*NOVO ATENDIMENTO VIA CHATBOT*\n`;
    text += `*Assunto:* ${type}\n\n`;
    Object.entries(collectedData).forEach(([key, value]) => {
      let label = key.split('_')[1] || key;
      label = label.charAt(0).toUpperCase() + label.slice(1);
      if (label === 'Name') label = 'Nome';
      if (label === 'Whatsapp') label = 'WhatsApp';
      if (label === 'City') label = 'Cidade';
      if (label === 'Neighborhood') label = 'Bairro';
      if (label === 'Desc') label = 'Descrição';
      if (label === 'Model') label = 'Modelo';
      if (label === 'People') label = 'Pessoas';
      if (label === 'Interest') label = 'Interesse';
      text += `*${label}:* ${value}\n`;
    });
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/5514981200302?text=${encoded}`, "_blank");
  };

  const handleOptionClick = (option: any) => {
    const userMsg: Message = {
      id: Math.random().toString(),
      type: 'user',
      content: option.label,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setCollectedData(prev => ({ ...prev, [currentStepId]: option.value }));
    setShowOptions(false);

    if (option.action) {
      option.action();
      return;
    }

    if (option.nextStep) {
      addBotMessages(option.nextStep);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setCollectedData(prev => ({ ...prev, [currentStepId]: inputValue }));
    
    const currentStep = steps[currentStepId];
    const nextStepId = currentStep.nextStep;
    setInputValue('');
    setShowOptions(false);

    if (nextStepId) {
      addBotMessages(nextStepId);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-muted dark:bg-slate-950 font-inter transition-colors duration-300">
      <header className="bg-[#075E54] dark:bg-slate-900 text-white px-4 py-3 flex items-center gap-3 shadow-md z-10 shrink-0">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden p-1 shadow-inner">
          <img src="https://res.cloudinary.com/dcii6r5op/image/upload/v1780514626/promaxx/hbz0wvmn31gofszatwhx.png" alt="Logo" className="w-full h-auto" />
        </div>
        <div>
          <h2 className="font-bold text-sm">Acqua Soft Connect</h2>
          <p className="text-[10px] text-white/80">Online agora</p>
        </div>
      </header>

      <div className={cn(
        "flex-1 overflow-y-auto p-4 space-y-4 pb-32 transition-colors duration-300",
        isDarkMode ? "bg-slate-900/50" : "bg-[#E5DDD5]"
      )}>
        <div className="bg-blue-100 dark:bg-slate-800 text-blue-800 dark:text-blue-300 text-[10px] font-bold py-1 px-3 rounded-lg mx-auto w-fit shadow-sm uppercase tracking-wider mb-6">Hoje</div>
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex items-end gap-2", msg.type === 'user' && "flex-row-reverse")}>
              {msg.type === 'bot' && (
                <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden p-1 shadow-sm shrink-0 border border-gray-100 dark:border-slate-600">
                  <img src="https://res.cloudinary.com/dcii6r5op/image/upload/v1780514626/promaxx/hbz0wvmn31gofszatwhx.png" alt="Bot" className="w-full h-auto" />
                </div>
              )}
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 10, x: msg.type === 'bot' ? -10 : 10 }} animate={{ opacity: 1, scale: 1, y: 0, x: 0 }} className={cn("max-w-[80%] rounded-2xl p-3 shadow-sm relative", msg.type === 'bot' ? "bg-card text-foreground rounded-bl-none" : "bg-[#DCF8C6] dark:bg-green-900/40 text-[#303030] dark:text-foreground rounded-br-none")}>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                <div className="text-[9px] text-muted-foreground text-right mt-1 opacity-70 flex items-center justify-end gap-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.type === 'user' && <CheckCircle2 className="w-3 h-3 text-[#34B7F1]" />}
                </div>
              </motion.div>
            </div>
          ))}
          {isBotTyping && (
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden p-1 shadow-sm shrink-0 border border-gray-100 dark:border-slate-600">
                <img src="https://res.cloudinary.com/dcii6r5op/image/upload/v1780514626/promaxx/hbz0wvmn31gofszatwhx.png" alt="Bot" className="w-full h-auto" />
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 10, x: -10 }} animate={{ opacity: 1, scale: 1, y: 0, x: 0 }} className="bg-card rounded-2xl p-1 shadow-sm rounded-bl-none">
                <TypingIndicator />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto space-y-3">
          <AnimatePresence mode="wait">
            {showOptions && steps[currentStepId]?.options && (
              <motion.div key={currentStepId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="grid gap-2">
                {steps[currentStepId].options?.map((option, idx) => (
                  <button key={idx} onClick={() => handleOptionClick(option)} className="bg-card hover:bg-muted text-foreground font-bold py-3 px-4 rounded-xl shadow-md border border-border flex items-center justify-between group active:scale-95 transition-all text-sm">
                    <div className="flex items-center gap-3">
                      {option.icon && <option.icon className="w-5 h-5 text-[#25D366] dark:text-green-400" />}
                      {option.label}
                    </div>
                    <Send className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {showOptions && steps[currentStepId]?.inputType && (
            <form onSubmit={handleInputSubmit} className="flex items-center gap-2">
              <div className="flex-1 bg-card rounded-full px-4 py-3 flex items-center shadow-md border border-border">
                <input autoFocus type={steps[currentStepId].inputType} value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={steps[currentStepId].placeholder} className="flex-1 bg-transparent outline-none text-sm font-medium text-foreground" />
              </div>
              <button type="submit" className="w-12 h-12 bg-[#075E54] dark:bg-slate-800 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
