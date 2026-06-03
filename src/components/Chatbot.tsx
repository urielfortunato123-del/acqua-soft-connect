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
  Phone,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string | React.ReactNode;
  timestamp: Date;
}

interface Step {
  id: string;
  message: string;
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

export function Chatbot({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Olá, seja bem-vindo à Acqua Soft. Como podemos ajudar você hoje?",
      timestamp: new Date(),
    }
  ]);
  const [currentStepId, setCurrentStepId] = useState('initial');
  const [inputValue, setInputValue] = useState('');
  const [collectedData, setCollectedData] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const steps: Record<string, Step> = {
    initial: {
      id: 'initial',
      message: "Como podemos ajudar você hoje?",
      options: [
        { label: "Quero comprar um purificador", icon: Droplet, value: "comprar", nextStep: "buy_name" },
        { label: "Suporte técnico", icon: Wrench, value: "suporte", nextStep: "support_name" },
        { label: "Manutenção preventiva", icon: ShieldCheck, value: "manutencao", nextStep: "maint_name" },
        { label: "Troca de refil", icon: Droplet, value: "refil", nextStep: "refil_name" },
        { label: "Área de atendimento", icon: MapPin, value: "area", nextStep: "area_info" },
        { label: "Falar com atendente", icon: MessageCircle, value: "atendente", action: () => openWhatsApp("Olá, gostaria de falar com um atendente.") },
      ]
    },
    // Buy Flow
    buy_name: {
      id: 'buy_name',
      message: "Excelente escolha! Qual é o seu nome?",
      inputType: 'text',
      placeholder: "Digite seu nome...",
      nextStep: "buy_phone"
    },
    buy_phone: {
      id: 'buy_phone',
      message: "Ótimo! Agora nos informe seu WhatsApp para enviarmos o catálogo e preços.",
      inputType: 'tel',
      placeholder: "(14) 99999-9999",
      nextStep: "buy_finish"
    },
    buy_finish: {
      id: 'buy_finish',
      message: "Perfeito! Vou te encaminhar agora mesmo para nossa equipe comercial.",
      options: [
        { label: "Finalizar no WhatsApp", value: "finish", action: () => finishFlow("COMPRA DE PURIFICADOR") }
      ]
    },
    // Support Flow
    support_name: {
      id: 'support_name',
      message: "Entendi. Qual é o seu nome para iniciarmos o atendimento?",
      inputType: 'text',
      placeholder: "Digite seu nome...",
      nextStep: "support_desc"
    },
    support_desc: {
      id: 'support_desc',
      message: "Poderia descrever brevemente o problema que está ocorrendo?",
      inputType: 'text',
      placeholder: "Ex: Não está gelando...",
      nextStep: "support_phone"
    },
    support_phone: {
      id: 'support_phone',
      message: "Qual o seu WhatsApp de contato?",
      inputType: 'tel',
      placeholder: "(14) 99999-9999",
      nextStep: "support_finish"
    },
    support_finish: {
      id: 'support_finish',
      message: "Vou encaminhar seu relato para nossos técnicos agora.",
      options: [
        { label: "Finalizar no WhatsApp", value: "finish", action: () => finishFlow("SUPORTE TÉCNICO") }
      ]
    },
    // Maintenance Flow
    maint_name: {
      id: 'maint_name',
      message: "Manutenção em dia é saúde! Qual seu nome?",
      inputType: 'text',
      placeholder: "Digite seu nome...",
      nextStep: "maint_phone"
    },
    maint_phone: {
      id: 'maint_phone',
      message: "Informe seu WhatsApp para agendarmos a visita.",
      inputType: 'tel',
      placeholder: "(14) 99999-9999",
      nextStep: "maint_finish"
    },
    maint_finish: {
      id: 'maint_finish',
      message: "Tudo pronto. Vamos agendar agora via WhatsApp.",
      options: [
        { label: "Finalizar no WhatsApp", value: "finish", action: () => finishFlow("MANUTENÇÃO PREVENTIVA") }
      ]
    },
    // Refill Flow
    refil_name: {
      id: 'refil_name',
      message: "Trocar o refil garante a pureza da sua água. Qual seu nome?",
      inputType: 'text',
      placeholder: "Digite seu nome...",
      nextStep: "refil_phone"
    },
    refil_phone: {
      id: 'refil_phone',
      message: "Informe seu WhatsApp para verificarmos o modelo correto do seu refil.",
      inputType: 'tel',
      placeholder: "(14) 99999-9999",
      nextStep: "refil_finish"
    },
    refil_finish: {
      id: 'refil_finish',
      message: "Vou te passar os modelos e valores no WhatsApp.",
      options: [
        { label: "Finalizar no WhatsApp", value: "finish", action: () => finishFlow("TROCA DE REFIL") }
      ]
    },
    // Area Info
    area_info: {
      id: 'area_info',
      message: "Atendemos Jaú e toda a região! Nossos técnicos se deslocam até você com rapidez.",
      options: [
        { label: "Voltar ao início", value: "back", nextStep: "initial" },
        { label: "Falar com atendente", value: "talk", action: () => openWhatsApp("Olá, gostaria de saber se atendem na minha cidade.") }
      ]
    }
  };

  const openWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/5514981200302?text=${encoded}`, "_blank");
  };

  const finishFlow = (type: string) => {
    let text = `*NOVO ATENDIMENTO VIA CHATBOT*\n`;
    text += `*Assunto:* ${type}\n`;
    Object.entries(collectedData).forEach(([key, value]) => {
      const label = key.includes('name') ? 'Nome' : key.includes('phone') ? 'WhatsApp' : key.includes('desc') ? 'Descrição' : key;
      text += `*${label}:* ${value}\n`;
    });
    openWhatsApp(text);
  };

  const handleOptionClick = (option: any) => {
    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      type: 'user',
      content: option.label,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    if (option.action) {
      option.action();
      return;
    }

    if (option.nextStep) {
      setTimeout(() => {
        const nextStep = steps[option.nextStep];
        const botMsg: Message = {
          id: Math.random().toString(),
          type: 'bot',
          content: nextStep.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
        setCurrentStepId(option.nextStep);
      }, 500);
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
    
    // Store data
    const currentStep = steps[currentStepId];
    setCollectedData(prev => ({ ...prev, [currentStepId]: inputValue }));
    
    const nextStepId = currentStep.nextStep;
    setInputValue('');

    if (nextStepId) {
      setTimeout(() => {
        const nextStep = steps[nextStepId];
        const botMsg: Message = {
          id: Math.random().toString(),
          type: 'bot',
          content: nextStep.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
        setCurrentStepId(nextStepId);
      }, 500);
    }
  };

  const currentStep = steps[currentStepId];

  return (
    <div className="flex flex-col h-screen bg-[#E5DDD5] font-inter">
      {/* WhatsApp Style Header */}
      <header className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 shadow-md z-10 shrink-0">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden p-1">
          <img 
            src="https://res.cloudinary.com/dcii6r5op/image/upload/v1780514626/promaxx/hbz0wvmn31gofszatwhx.png" 
            alt="Logo" 
            className="w-full h-auto"
          />
        </div>

        <div>
          <h2 className="font-bold text-sm">Acqua Soft Connect</h2>
          <p className="text-[10px] text-white/80">Online agora</p>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        <div className="bg-[#D1E9FF] text-[#4A5568] text-[10px] font-bold py-1 px-3 rounded-lg mx-auto w-fit shadow-sm uppercase tracking-wider">
          Hoje
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={cn(
                "max-w-[85%] rounded-2xl p-3 shadow-sm relative",
                msg.type === 'bot' 
                  ? "bg-white self-start text-[#303030] rounded-tl-none" 
                  : "bg-[#DCF8C6] self-end text-[#303030] rounded-tr-none ml-auto"
              )}
            >
              <div className="text-sm leading-relaxed">{msg.content}</div>
              <div className="text-[10px] text-gray-400 text-right mt-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Options Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent pointer-events-none">
        <div className="max-w-md mx-auto pointer-events-auto space-y-3">
          
          {/* Action Options */}
          <AnimatePresence mode="wait">
            {currentStep?.options && (
              <motion.div 
                key={currentStepId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="grid gap-2"
              >
                {currentStep.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(option)}
                    className="bg-white hover:bg-gray-50 text-[#075E54] font-bold py-3 px-4 rounded-xl shadow-md border border-gray-100 flex items-center justify-between group active:scale-95 transition-all text-sm"
                  >
                    <div className="flex items-center gap-3">
                      {option.icon && <option.icon className="w-5 h-5 text-[#25D366]" />}
                      {option.label}
                    </div>
                    <Send className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text Input */}
          {currentStep?.inputType && (
            <form 
              onSubmit={handleInputSubmit}
              className="flex items-center gap-2"
            >
              <div className="flex-1 bg-white rounded-full px-4 py-3 flex items-center shadow-md">
                <input 
                  autoFocus
                  type={currentStep.inputType}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={currentStep.placeholder}
                  className="flex-1 bg-transparent outline-none text-sm font-medium"
                />
              </div>
              <button 
                type="submit"
                className="w-12 h-12 bg-[#075E54] text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
