import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, Camera, Video, Mic, Send, ArrowLeft, Loader2, Info } from "lucide-react";
import { 
  cn, 
  PURIFIER_MODELS, 
  SERVICE_TYPES, 
  PROBLEMS, 
  MAINTENANCE_PERIODS,
  formatWhatsAppMessage 
} from "../lib/utils";
import { toast } from "sonner";

interface AtendimentoSearchParams {
  tipo: string;
  cliente: string;
}

export const Route = createFileRoute("/atendimento")({
  validateSearch: (search: Record<string, unknown>): AtendimentoSearchParams => {
    return {
      tipo: (search.tipo as string) || "suporte",
      cliente: (search.cliente as string) || "nao",
    };
  },
  component: AtendimentoPage,
});

function AtendimentoPage() {
  const { tipo, cliente } = Route.useSearch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [files, setFiles] = useState<{file: File, type: 'image' | 'video' | 'audio', preview: string}[]>([]);
  
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

  const tipoImovel = watch("tipo_imovel");
  const modeloPurificador = watch("modelo_purificador");
  const problema = watch("problema");

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
      const mediaUrls: string[] = [];
      
      // Save to Database first to get record or just send WhatsApp
      // Note: storage bucket must exist. If not, this might fail.
      
      const waMessage = formatWhatsAppMessage(data);
      const waUrl = `https://wa.me/5514981200302?text=${waMessage}`;
      
      toast.success("Enviando para o WhatsApp...");
      setTimeout(() => {
        window.location.href = waUrl;
      }, 1000);

    } catch (error: any) {
      toast.error("Erro ao processar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Dynamic Header */}
      <div className="bg-primary pt-6 pb-12 px-6 rounded-b-[2.5rem] shadow-lg">
        <button onClick={() => navigate({ to: "/" })} className="mb-6 bg-white/10 p-2 rounded-full backdrop-blur-md">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
             <Info className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight">
              {SERVICE_TYPES[tipo.toUpperCase() as keyof typeof SERVICE_TYPES] || "Atendimento"}
            </h1>
            <p className="text-blue-100 text-sm">Preencha os dados abaixo</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-secondary rounded-full"></span>
              Dados de Contato
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nome Completo</label>
                <input 
                  {...register("nome", { required: true })} 
                  className={cn("w-full p-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:border-secondary transition-all outline-none", errors.nome && "border-red-500")}
                  placeholder="Seu nome aqui"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">WhatsApp</label>
                <input 
                  {...register("telefone", { required: true })} 
                  className={cn("w-full p-4 bg-gray-50 border-transparent border-2 rounded-2xl focus:border-secondary transition-all outline-none", errors.telefone && "border-red-500")}
                  placeholder="(14) 99999-9999"
                  type="tel"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Cidade</label>
                  <input {...register("cidade", { required: true })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" placeholder="Ex: Jaú" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Bairro</label>
                  <input {...register("bairro", { required: true })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none" placeholder="Centro" />
                </div>
              </div>

              <button 
                type="button"
                onClick={captureLocation}
                disabled={locationLoading}
                className="w-full flex items-center justify-center gap-3 p-4 bg-blue-50 text-blue-600 font-bold rounded-2xl hover:bg-blue-100 active:scale-[0.98] transition-all"
              >
                {locationLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                Compartilhar Localização
              </button>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
            <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-secondary rounded-full"></span>
              Detalhes
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Modelo Purificador</label>
                <select {...register("modelo_purificador")} className="w-full p-4 bg-gray-50 rounded-2xl outline-none appearance-none">
                  {PURIFIER_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {modeloPurificador === 'Outro' && (
                <input {...register("modelo_outro")} className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-blue-100 animate-in fade-in" placeholder="Qual o modelo?" />
              )}

              {tipo === 'suporte' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">O que está acontecendo?</label>
                  <select {...register("problema")} className="w-full p-4 bg-gray-50 rounded-2xl outline-none">
                    {PROBLEMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Observações</label>
                <textarea {...register("descricao")} className="w-full p-4 bg-gray-50 rounded-2xl outline-none h-24" placeholder="Algum detalhe adicional?" />
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
             <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <span className="w-1 h-6 bg-secondary rounded-full"></span>
              Anexos
            </h2>
            <div className="flex gap-3">
              {[
                { icon: Camera, type: 'image' },
                { icon: Video, type: 'video' },
                { icon: Mic, type: 'audio' }
              ].map((media) => (
                <label key={media.type} className="flex-1 aspect-square bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-secondary cursor-pointer transition-all">
                  <media.icon className="w-6 h-6 text-gray-400" />
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, media.type as any)} />
                </label>
              ))}
            </div>
            {files.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {files.map((f, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0">
                    {f.type === 'image' && <img src={f.preview} className="w-full h-full object-cover rounded-lg" />}
                    <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] font-bold">X</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Final Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-16 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
            ENVIAR ATENDIMENTO
          </button>
        </form>
      </div>
    </div>
  );
}
