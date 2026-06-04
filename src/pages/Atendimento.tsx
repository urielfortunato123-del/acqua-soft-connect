import { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  MapPin, 
  Camera, 
  Video, 
  Mic, 
  Send, 
  ArrowLeft, 
  Loader2, 
  Info,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Settings,
  Droplet,
  Wrench,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  cn, 
  PURIFIER_MODELS, 
  SERVICE_TYPES, 
  PROBLEMS, 
  MAINTENANCE_PERIODS,
  formatWhatsAppMessage 
} from "../lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface AtendimentoProps {
  tipo: string;
  cliente: string;
}

export default function Atendimento({ tipo, cliente }: AtendimentoProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [files, setFiles] = useState<{file: File, type: 'image' | 'video' | 'audio', preview: string}[]>([]);
  const [step, setStep] = useState(1);
  
  const totalSteps = 3;
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      tipo: SERVICE_TYPES[tipo.toUpperCase() as keyof typeof SERVICE_TYPES] || tipo,
      nome: "",
      telefone: "",
      cidade: "",
      bairro: "",
      endereco: "",
      latitude: null as number | null,
      longitude: null as number | null,
      maps_link: "",
      tipo_imovel: "Casa",
      andar: "",
      elevador: false,
      caixa_alta_pressao: false,
      modelo_purificador: "Soft Fit",
      modelo_outro: "",
      problema: "Não gela",
      problema_outro: "",
      descricao: "",
      ultima_manutencao: "6 meses",
      adquirido_anteriormente: cliente === 'sim',
    }
  });

  const watchAllFields = watch();

  const nextStep = () => {
    if (step === 1) {
      if (!watchAllFields.nome || !watchAllFields.telefone) {
        toast.error("Por favor, preencha nome e telefone.");
        return;
      }
    }
    setStep(s => Math.min(s + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    if (step === 1) {
      navigate("/");
    } else {
      setStep(s => Math.max(s - 1, 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const captureLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      toast.error("Geolocalização não suportada.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setValue("latitude", latitude);
        setValue("longitude", longitude);
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setValue("maps_link", mapsLink);
        toast.success("Localização capturada!");
        setLocationLoading(false);
      },
      () => {
        toast.error("Não foi possível obter a localização.");
        setLocationLoading(false);
      }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles([...files, { file, type, preview: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const waMessage = formatWhatsAppMessage(data);
      const waUrl = `https://wa.me/5514981200302?text=${waMessage}`;
      
      toast.success("Enviando solicitação...");
      setTimeout(() => {
        window.location.href = waUrl;
      }, 800);

    } catch (error: any) {
      toast.error("Erro ao processar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-inter">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="px-6 py-4 flex items-center justify-between">
          <button 
            onClick={prevStep}
            className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-[#003B73] active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h1 className="text-sm font-bold text-gray-900 uppercase tracking-widest">
              {SERVICE_TYPES[tipo.toUpperCase() as keyof typeof SERVICE_TYPES] || "Atendimento"}
            </h1>
            <p className="text-[10px] text-gray-400 font-bold">Passo {step} de {totalSteps}</p>
          </div>
          <div className="w-10" />
        </div>
        <div className="h-1.5 w-full bg-gray-100 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#003B73] to-[#00B4D8]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="px-6 pt-8 max-w-lg mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold text-[#003B73]">Vamos começar?</h2>
                  <p className="text-gray-500 font-medium">Precisamos dos seus dados básicos para contato.</p>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Seu Nome</label>
                    <input 
                      {...register("nome", { required: true })} 
                      className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#0077B6] rounded-2xl outline-none transition-all font-medium"
                      placeholder="Como podemos te chamar?"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">WhatsApp</label>
                    <input 
                      {...register("telefone", { required: true })} 
                      className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#0077B6] rounded-2xl outline-none transition-all font-medium"
                      placeholder="(14) 99999-9999"
                    />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-[#003B73]">Sua Localização</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input {...register("cidade")} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium text-sm" placeholder="Cidade" />
                    <input {...register("bairro")} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium text-sm" placeholder="Bairro" />
                  </div>
                  <button 
                    type="button"
                    onClick={captureLocation}
                    disabled={locationLoading}
                    className="w-full p-4 bg-[#0077B6] text-white font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    {locationLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                    Pegar Localização Atual
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold text-[#003B73]">Sobre o Purificador</h2>
                  <p className="text-gray-500 font-medium">Conte-nos mais sobre o seu equipamento.</p>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Modelo</label>
                    <select {...register("modelo_purificador")} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-[#003B73] appearance-none">
                      {PURIFIER_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Descreva o que houve</label>
                    <textarea 
                      {...register("descricao")} 
                      className="w-full p-4 bg-gray-50 rounded-2xl outline-none h-32 font-medium resize-none" 
                      placeholder="Detalhes que podem nos ajudar..." 
                    />
                  </div>
                </div>

                <div className="bg-[#003B73]/5 p-6 rounded-[2rem] border border-blue-100/50 flex gap-4">
                  <AlertCircle className="w-6 h-6 text-[#003B73] shrink-0" />
                  <p className="text-sm text-[#003B73] font-medium leading-relaxed">
                    Sua segurança é nossa prioridade. Todos os atendimentos são realizados por técnicos certificados.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold text-[#003B73]">Tudo pronto!</h2>
                  <p className="text-gray-500 font-medium">Revise e envie sua solicitação agora mesmo.</p>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Serviço</span>
                      <span className="text-[#003B73] font-extrabold">{SERVICE_TYPES[tipo.toUpperCase() as keyof typeof SERVICE_TYPES] || tipo}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Nome</span>
                      <span className="text-[#003B73] font-bold">{watchAllFields.nome}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Modelo</span>
                      <span className="text-[#003B73] font-bold">{watchAllFields.modelo_purificador}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
                   <h3 className="font-bold text-[#003B73] mb-2 flex items-center gap-2">
                    <Camera className="w-5 h-5" /> Fotos ou Vídeos (Opcional)
                   </h3>
                   <div className="flex gap-3">
                    <label className="flex-1 aspect-square bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#0077B6] cursor-pointer transition-all">
                      <Camera className="w-6 h-6 text-gray-300" />
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                    </label>
                    <label className="flex-1 aspect-square bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#0077B6] cursor-pointer transition-all">
                      <Video className="w-6 h-6 text-gray-300" />
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pt-2">
                      {files.map((f, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                          {f.type === 'image' ? <img src={f.preview} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-blue-100 flex items-center justify-center"><Video className="w-6 h-6 text-blue-500" /></div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-40">
            <div className="max-w-lg mx-auto">
              {step < totalSteps ? (
                <button 
                  type="button"
                  onClick={nextStep}
                  className="w-full h-16 bg-[#003B73] text-white font-bold rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 transition-transform"
                >
                  PRÓXIMO PASSO <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-gradient-to-r from-[#003B73] to-[#0077B6] text-white font-bold rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                  CONFIRMAR E ENVIAR
                </button>
              )}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
