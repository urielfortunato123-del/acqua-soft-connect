import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormLayout } from "./FormLayout";
import { useLocation } from "../../hooks/use-location";
import { MapPin, Camera, Video, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { uploadAttachment } from "@/lib/storage";

export function TechnicalSupportForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<{type: 'image' | 'video', preview: string, file: File}[]>([]);
  
  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm({
    mode: "onChange",
    defaultValues: {
      nome: "",
      whatsapp: "",
      cidade: "",
      bairro: "",
      tipo_imovel: "Casa",
      andar: "",
      caixa_alta_pressao: "Não sei",
      modelo: "Soft Fit",
      problema: "Não gela",
      descricao: "",
      latitude: null as number | null,
      longitude: null as number | null,
      maps_link: "",
    }
  });

  const watchAll = watch();
  const { captureLocation, loading: locationLoading } = useLocation(setValue);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      let attachmentLinks = "";
      if (files.length > 0) {
        toast.info("Enviando anexos...");
        const uploadPromises = files.map(f => uploadAttachment(f.file));
        const urls = await Promise.all(uploadPromises);
        const validUrls = urls.filter(url => url !== null);
        
        if (validUrls.length > 0) {
          attachmentLinks = "\n\n*ANEXOS SALVOS:*";
          validUrls.forEach((url, idx) => {
            attachmentLinks += `\nLink ${idx + 1}: ${url}`;
          });
          toast.success("Os anexos foram salvos e os links serão enviados junto com o atendimento.");
        }
      }

      let message = `*NOVO ATENDIMENTO ACQUA SOFT*\n`;
      message += `*Tipo:* Suporte Técnico\n\n`;
      message += `*DADOS DO CLIENTE*\n`;
      message += `*Nome:* ${data.nome}\n`;
      message += `*WhatsApp:* ${data.whatsapp}\n`;
      message += `*Cidade:* ${data.cidade}\n`;
      message += `*Bairro:* ${data.bairro}\n\n`;
      
      message += `*LOCAL DA INSTALAÇÃO*\n`;
      message += `*Tipo de imóvel:* ${data.tipo_imovel}\n`;
      if (data.tipo_imovel === "Apartamento") {
        message += `*Andar:* ${data.andar}\n`;
      }
      message += `*Caixa de alta pressão:* ${data.caixa_alta_pressao}\n\n`;
      
      message += `*EQUIPAMENTO E PROBLEMA*\n`;
      message += `*Modelo:* ${data.modelo}\n`;
      message += `*Problema:* ${data.problema}\n`;
      message += `*Descrição:* ${data.descricao}\n`;
      
      if (data.maps_link) {
        message += `\n*Localização:* ${data.maps_link}`;
      }
      
      message += attachmentLinks;
      
      const waUrl = `https://wa.me/5514981200302?text=${encodeURIComponent(message)}`;
      window.location.href = waUrl;
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao processar o atendimento.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) window.history.back();
    else setStep(s => s - 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles(prev => [...prev, { type, preview: reader.result as string, file }]);
        toast.success(`${type === 'image' ? 'Foto' : 'Vídeo'} adicionada!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const isStepValid = () => {
    if (step === 1) return !!(watchAll.nome && watchAll.whatsapp && watchAll.cidade && watchAll.bairro);
    if (step === 2 && watchAll.tipo_imovel === "Apartamento") return !!watchAll.andar;
    if (step === 6) return !!watchAll.descricao;
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormLayout
        title="Suporte Técnico"
        step={step}
        totalSteps={8}
        onPrev={prevStep}
        onNext={nextStep}
        isLastStep={step === 8}
        isLoading={loading}
        isValid={isStepValid()}
      >
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-primary">Dados de Contato</h2>
              <p className="text-muted-foreground font-medium">Como podemos te identificar e localizar?</p>
            </div>
            <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border space-y-4">
              <input {...register("nome", { required: true })} placeholder="Seu Nome completo" className="w-full p-4 bg-muted rounded-2xl outline-none font-medium border-2 border-transparent focus:border-secondary text-foreground placeholder:text-muted-foreground" />
              <input {...register("whatsapp", { required: true })} placeholder="WhatsApp (DDD)" className="w-full p-4 bg-muted rounded-2xl outline-none font-medium border-2 border-transparent focus:border-secondary text-foreground placeholder:text-muted-foreground" />
              <div className="grid grid-cols-2 gap-3">
                <input {...register("cidade", { required: true })} placeholder="Cidade" className="w-full p-4 bg-muted rounded-2xl outline-none font-medium border-2 border-transparent focus:border-secondary text-foreground placeholder:text-muted-foreground" />
                <input {...register("bairro", { required: true })} placeholder="Bairro" className="w-full p-4 bg-muted rounded-2xl outline-none font-medium border-2 border-transparent focus:border-secondary text-foreground placeholder:text-muted-foreground" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-primary">Tipo de Imóvel</h2>
              <p className="text-muted-foreground font-medium">Onde o equipamento está instalado?</p>
            </div>
            <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border space-y-4">
              <select {...register("tipo_imovel")} className="w-full p-4 bg-muted rounded-2xl outline-none font-bold text-primary appearance-none border-2 border-transparent focus:border-secondary dark:bg-slate-800 text-foreground">
                <option value="Casa">Casa</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Comercial">Comercial</option>
              </select>
              {watchAll.tipo_imovel === "Apartamento" && (
                <input {...register("andar", { required: true })} placeholder="Qual o andar?" className="w-full p-4 bg-muted rounded-2xl outline-none font-medium border-2 border-transparent focus:border-secondary text-foreground placeholder:text-muted-foreground" />
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-primary">Pressão da Água</h2>
              <p className="text-muted-foreground font-medium">Possui caixa de alta pressão?</p>
            </div>
            <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border grid grid-cols-1 gap-3">
              {["Sim", "Não", "Não sei"].map(opt => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setValue("caixa_alta_pressao", opt)}
                  className={`w-full p-4 rounded-2xl font-bold text-left transition-all ${watchAll.caixa_alta_pressao === opt ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-primary">Modelo do Purificador</h2>
              <p className="text-muted-foreground font-medium">Qual modelo você possui?</p>
            </div>
            <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border grid grid-cols-1 gap-3">
              {["Soft Baby", "Soft Fit", "Soft Slim", "Soft Everest", "Soft Star", "Outro"].map(opt => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setValue("modelo", opt)}
                  className={`w-full p-4 rounded-2xl font-bold text-left transition-all ${watchAll.modelo === opt ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-primary">Problema Encontrado</h2>
              <p className="text-muted-foreground font-medium">O que está acontecendo?</p>
            </div>
            <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border grid grid-cols-1 gap-3">
              {["Não gela", "Vazamento", "Não sai água", "Água com gosto estranho", "Barulho anormal", "Outro"].map(opt => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setValue("problema", opt)}
                  className={`w-full p-4 rounded-2xl font-bold text-left transition-all ${watchAll.problema === opt ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-primary">Descrição Detalhada</h2>
              <p className="text-muted-foreground font-medium">Explique melhor o problema.</p>
            </div>
            <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border">
              <textarea 
                {...register("descricao", { required: true })} 
                className="w-full p-4 bg-muted rounded-2xl outline-none h-40 font-medium resize-none border-2 border-transparent focus:border-secondary text-foreground placeholder:text-muted-foreground" 
                placeholder="Conte-nos o que aconteceu..."
              />
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-primary">Anexos (Opcional)</h2>
              <p className="text-muted-foreground font-medium">Fotos ou vídeos ajudam no diagnóstico.</p>
            </div>
            <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border space-y-4">
              <div className="flex gap-3">
                <label className="flex-1 aspect-square bg-muted rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-secondary cursor-pointer transition-all">
                  <Camera className="w-8 h-8 text-muted-foreground/30" />
                  <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase">Foto</span>
                  <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                </label>
                <label className="flex-1 aspect-square bg-muted rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-secondary cursor-pointer transition-all">
                  <Video className="w-8 h-8 text-muted-foreground/30" />
                  <span className="text-[10px] font-bold text-muted-foreground mt-2 uppercase">Vídeo</span>
                  <input type="file" accept="video/*" capture="environment" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
                </label>
              </div>
              {files.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {files.map((f, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden shadow-sm shrink-0 border border-border">
                      {f.type === 'image' ? <img src={f.preview} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center"><Video className="w-8 h-8 text-blue-500" /></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-primary">Sua Localização</h2>
              <p className="text-muted-foreground font-medium">Isso ajuda o técnico a chegar mais rápido.</p>
            </div>
            <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border space-y-4">
              <button 
                type="button"
                onClick={captureLocation}
                disabled={locationLoading}
                className="w-full p-6 bg-secondary text-secondary-foreground font-bold rounded-2xl flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${locationLoading ? 'bg-white/20' : 'bg-white text-secondary'}`}>
                  <MapPin className={`w-6 h-6 ${locationLoading ? 'animate-bounce' : ''}`} />
                </div>
                {locationLoading ? "Obtendo localização..." : "Enviar minha localização atual"}
              </button>
              {watchAll.maps_link && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800/30 flex items-center gap-3 text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-bold">Localização capturada com sucesso!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </FormLayout>
    </form>
  );
}

import { CheckCircle2 } from "lucide-react";
