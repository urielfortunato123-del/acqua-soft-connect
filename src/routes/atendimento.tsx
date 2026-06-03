import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MapPin, Camera, Video, Mic, Send, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
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
      toast.error("Geolocalização não suportada pelo seu navegador.");
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
        toast.success("Localização capturada com sucesso!");
        setLocationLoading(false);
      },
      (error) => {
        console.error(error);
        toast.error("Não foi possível capturar sua localização.");
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
      
      // Upload files to Supabase Storage
      for (const item of files) {
        const fileExt = item.file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${data.tipo}/${fileName}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('atendimentos_media')
          .upload(filePath, item.file);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('atendimentos_media')
          .getPublicUrl(filePath);
          
        mediaUrls.push(publicUrl);
      }

      // Save to Database
      const { error: dbError } = await supabase
        .from('atendimentos')
        .insert([{ ...data, media_urls: mediaUrls }]);

      if (dbError) throw dbError;

      // Format WhatsApp Message and Redirect
      const waMessage = formatWhatsAppMessage(data);
      const waUrl = `https://wa.me/5514981200302?text=${waMessage}`;
      
      toast.success("Solicitação enviada! Redirecionando para o WhatsApp...");
      setTimeout(() => {
        window.location.href = waUrl;
      }, 1500);

    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao enviar: " + (error.message || "Tente novamente."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        <h1 className="text-xl font-bold text-primary">{SERVICE_TYPES[tipo.toUpperCase() as keyof typeof SERVICE_TYPES] || tipo}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Dados Pessoais */}
        <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm border">
          <h2 className="font-bold text-lg border-b pb-2 text-primary">Informações de Contato</h2>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Nome Completo *</label>
            <input 
              {...register("nome", { required: true })} 
              className={cn("p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary outline-none", errors.nome && "border-red-500")}
              placeholder="Digite seu nome"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Telefone (WhatsApp) *</label>
            <input 
              {...register("telefone", { required: true })} 
              className={cn("p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary outline-none", errors.telefone && "border-red-500")}
              placeholder="(00) 00000-0000"
              type="tel"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Cidade *</label>
              <input 
                {...register("cidade", { required: true })} 
                className="p-3 border rounded-lg bg-gray-50 outline-none"
                placeholder="Ex: Jaú"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Bairro *</label>
              <input 
                {...register("bairro", { required: true })} 
                className="p-3 border rounded-lg bg-gray-50 outline-none"
                placeholder="Ex: Centro"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Endereço Completo</label>
            <input 
              {...register("endereco")} 
              className="p-3 border rounded-lg bg-gray-50 outline-none"
              placeholder="Rua, número, complemento"
            />
          </div>

          <button 
            type="button"
            onClick={captureLocation}
            disabled={locationLoading}
            className="w-full flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            {locationLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
            Usar Minha Localização Atual
          </button>
        </div>

        {/* Informações do Imóvel (Apenas para Orçamento) */}
        {tipo === 'orcamento' && (
          <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm border">
            <h2 className="font-bold text-lg border-b pb-2 text-primary">Informações do Imóvel</h2>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Tipo de Imóvel</label>
              <select {...register("tipo_imovel")} className="p-3 border rounded-lg bg-gray-50 outline-none">
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Comercial">Comercial</option>
              </select>
            </div>

            {tipoImovel === 'Apartamento' && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Andar</label>
                  <input {...register("andar")} className="p-3 border rounded-lg bg-gray-50 outline-none" placeholder="Ex: 8º" />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input type="checkbox" {...register("elevador")} className="w-5 h-5" />
                  <label className="text-sm font-medium">Possui elevador?</label>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input type="checkbox" {...register("caixa_alta_pressao")} className="w-5 h-5" />
              <label className="text-sm font-medium">Existe caixa de alta pressão?</label>
            </div>
          </div>
        )}

        {/* Equipamento */}
        <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm border">
          <h2 className="font-bold text-lg border-b pb-2 text-primary">
            {tipo === 'orcamento' ? 'Modelo Desejado' : 'Equipamento'}
          </h2>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Modelo do Purificador</label>
            <select {...register("modelo_purificador")} className="p-3 border rounded-lg bg-gray-50 outline-none">
              {PURIFIER_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          {modeloPurificador === 'Outro' && (
            <div className="grid gap-2 animate-in slide-in-from-top-2">
              <label className="text-sm font-medium">Qual o modelo?</label>
              <input {...register("modelo_outro")} className="p-3 border rounded-lg bg-gray-50 outline-none" placeholder="Digite o modelo" />
            </div>
          )}

          {tipo === 'refil' && (
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" {...register("adquirido_anteriormente")} className="w-5 h-5" />
              <label className="text-sm font-medium">Refil adquirido anteriormente na Acqua Soft?</label>
            </div>
          )}
        </div>

        {/* Suporte Técnico - Problemas */}
        {tipo === 'suporte' && (
          <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm border">
            <h2 className="font-bold text-lg border-b pb-2 text-primary">Problema Encontrado</h2>
            <div className="grid gap-2">
              <label className="text-sm font-medium">O que está acontecendo?</label>
              <select {...register("problema")} className="p-3 border rounded-lg bg-gray-50 outline-none">
                {PROBLEMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {problema === 'Outro' && (
              <div className="grid gap-2 animate-in slide-in-from-top-2">
                <label className="text-sm font-medium">Descreva o problema</label>
                <input {...register("problema_outro")} className="p-3 border rounded-lg bg-gray-50 outline-none" placeholder="O que ocorreu?" />
              </div>
            )}
          </div>
        )}

        {/* Manutenção Preventiva */}
        {tipo === 'manutencao' && (
          <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm border">
            <h2 className="font-bold text-lg border-b pb-2 text-primary">Última Manutenção</h2>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Quanto tempo faz a última manutenção?</label>
              <select {...register("ultima_manutencao")} className="p-3 border rounded-lg bg-gray-50 outline-none">
                {MAINTENANCE_PERIODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Uploads e Anexos */}
        <div className="space-y-4 bg-white p-4 rounded-xl shadow-sm border">
          <h2 className="font-bold text-lg border-b pb-2 text-primary">Anexos (Fotos/Vídeos/Áudio)</h2>
          
          <div className="flex flex-wrap gap-4">
            <label className="flex-1 min-w-[120px] flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl border-gray-200 hover:border-primary cursor-pointer transition-colors text-gray-500 hover:text-primary">
              <Camera className="w-8 h-8 mb-2" />
              <span className="text-xs font-medium">Foto</span>
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />
            </label>

            <label className="flex-1 min-w-[120px] flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl border-gray-200 hover:border-primary cursor-pointer transition-colors text-gray-500 hover:text-primary">
              <Video className="w-8 h-8 mb-2" />
              <span className="text-xs font-medium">Vídeo</span>
              <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="hidden" />
            </label>

            <label className="flex-1 min-w-[120px] flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl border-gray-200 hover:border-primary cursor-pointer transition-colors text-gray-500 hover:text-primary">
              <Mic className="w-8 h-8 mb-2" />
              <span className="text-xs font-medium">Áudio</span>
              <input type="file" accept="audio/*" onChange={(e) => handleFileUpload(e, 'audio')} className="hidden" />
            </label>
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {files.map((item, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border">
                  {item.type === 'image' && <img src={item.preview} className="w-full h-full object-cover" />}
                  {item.type === 'video' && <div className="w-full h-full bg-black flex items-center justify-center"><Video className="text-white" /></div>}
                  {item.type === 'audio' && <div className="w-full h-full bg-gray-100 flex items-center justify-center"><Mic className="text-primary" /></div>}
                  <button 
                    type="button"
                    onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid gap-2 pt-2">
            <label className="text-sm font-medium">Observações Adicionais</label>
            <textarea 
              {...register("descricao")} 
              className="p-3 border rounded-lg bg-gray-50 outline-none h-24"
              placeholder="Descreva aqui qualquer detalhe importante..."
            />
          </div>
        </div>

        {/* Botão Enviar */}
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary w-full h-16 shadow-2xl sticky bottom-4 z-40"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          ENVIAR ATENDIMENTO
        </button>
      </form>
    </div>
  );
}
