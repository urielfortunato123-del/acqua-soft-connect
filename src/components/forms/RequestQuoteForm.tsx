import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormLayout } from "./FormLayout";
import { useLocation } from "../../hooks/use-location";
import { MapPin, Camera, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function RequestQuoteForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<{preview: string}[]>([]);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      nome: "",
      whatsapp: "",
      cidade: "",
      bairro: "",
      tipo_imovel: "Casa",
      andar: "",
      qtd_pessoas: "1 a 2",
      caixa_alta_pressao: "Não sei",
      interesse: "Água gelada e natural",
      latitude: null as number | null,
      longitude: null as number | null,
      maps_link: "",
    }
  });

  const watchAll = watch();
  const { captureLocation, loading: locationLoading } = useLocation(setValue);

  const onSubmit = (data: any) => {
    setLoading(true);
    let message = `*NOVO ORÇAMENTO ACQUA SOFT*\n\n`;
    message += `*DADOS DO CLIENTE*\n`;
    message += `*Nome:* ${data.nome}\n`;
    message += `*WhatsApp:* ${data.whatsapp}\n`;
    message += `*Cidade:* ${data.cidade}\n`;
    message += `*Bairro:* ${data.bairro}\n\n`;
    
    message += `*NECESSIDADE DO CLIENTE*\n`;
    message += `*Tipo de imóvel:* ${data.tipo_imovel}\n`;
    if (data.tipo_imovel === "Apartamento") {
      message += `*Andar:* ${data.andar}\n`;
    }
    message += `*Qtd. pessoas:* ${data.qtd_pessoas}\n`;
    message += `*Caixa de alta pressão:* ${data.caixa_alta_pressao}\n`;
    message += `*Interesse:* ${data.interesse}\n`;
    
    if (data.maps_link) {
      message += `\n*Localização:* ${data.maps_link}\n`;
    }
    
    const waUrl = `https://wa.me/5514981200302?text=${encodeURIComponent(message)}`;
    window.location.href = waUrl;
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => {
    if (step === 1) window.history.back();
    else setStep(s => s - 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles(prev => [...prev, { preview: reader.result as string }]);
        toast.success(`Foto adicionada!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const isStepValid = () => {
    if (step === 1) return !!(watchAll.nome && watchAll.whatsapp && watchAll.cidade && watchAll.bairro);
    if (step === 2 && watchAll.tipo_imovel === "Apartamento") return !!watchAll.andar;
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormLayout
        title="Solicitar Orçamento"
        step={step}
        totalSteps={7}
        onPrev={prevStep}
        onNext={nextStep}
        isLastStep={step === 7}
        isLoading={loading}
        isValid={isStepValid()}
      >
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#003B73]">Dados de Contato</h2>
              <p className="text-gray-500 font-medium">Como podemos te identificar?</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
              <input {...register("nome", { required: true })} placeholder="Seu Nome completo" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium border-2 border-transparent focus:border-[#0077B6]" />
              <input {...register("whatsapp", { required: true })} placeholder="WhatsApp (DDD)" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium border-2 border-transparent focus:border-[#0077B6]" />
              <div className="grid grid-cols-2 gap-3">
                <input {...register("cidade", { required: true })} placeholder="Cidade" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium border-2 border-transparent focus:border-[#0077B6]" />
                <input {...register("bairro", { required: true })} placeholder="Bairro" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium border-2 border-transparent focus:border-[#0077B6]" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#003B73]">Tipo de Imóvel</h2>
              <p className="text-gray-500 font-medium">Onde será instalado o purificador?</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 grid grid-cols-1 gap-3">
              {["Casa", "Apartamento", "Empresa"].map(opt => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setValue("tipo_imovel", opt)}
                  className={`w-full p-4 rounded-2xl font-bold text-left transition-all ${watchAll.tipo_imovel === opt ? 'bg-[#003B73] text-white' : 'bg-gray-50 text-gray-500'}`}
                >
                  {opt}
                </button>
              ))}
              {watchAll.tipo_imovel === "Apartamento" && (
                <input {...register("andar", { required: true })} placeholder="Qual o andar?" className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-medium border-2 border-transparent focus:border-[#0077B6] mt-2" />
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#003B73]">Quantidade de Pessoas</h2>
              <p className="text-gray-500 font-medium">Para quantas pessoas é o purificador?</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 grid grid-cols-1 gap-3">
              {["1 a 2", "3 a 4", "5 a 6", "Mais de 6"].map(opt => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setValue("qtd_pessoas", opt)}
                  className={`w-full p-4 rounded-2xl font-bold text-left transition-all ${watchAll.qtd_pessoas === opt ? 'bg-[#003B73] text-white' : 'bg-gray-50 text-gray-500'}`}
                >
                  {opt} pessoas
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#003B73]">Pressão da Água</h2>
              <p className="text-gray-500 font-medium">O local possui caixa de alta pressão?</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 grid grid-cols-1 gap-3">
              {["Sim", "Não", "Não sei"].map(opt => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setValue("caixa_alta_pressao", opt)}
                  className={`w-full p-4 rounded-2xl font-bold text-left transition-all ${watchAll.caixa_alta_pressao === opt ? 'bg-[#003B73] text-white' : 'bg-gray-50 text-gray-500'}`}
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
              <h2 className="text-2xl font-extrabold text-[#003B73]">Seu Interesse</h2>
              <p className="text-gray-500 font-medium">Qual tipo de água você prefere?</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 grid grid-cols-1 gap-3">
              {["Água natural", "Água gelada", "Água gelada e natural", "Não sei qual modelo escolher"].map(opt => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setValue("interesse", opt)}
                  className={`w-full p-4 rounded-2xl font-bold text-left transition-all ${watchAll.interesse === opt ? 'bg-[#003B73] text-white' : 'bg-gray-50 text-gray-500'}`}
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
              <h2 className="text-2xl font-extrabold text-[#003B73]">Foto do Local (Opcional)</h2>
              <p className="text-gray-500 font-medium">Uma foto do local de instalação ajuda muito!</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
              <label className="w-full aspect-video bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#0077B6] cursor-pointer transition-all">
                <Camera className="w-10 h-10 text-gray-300" />
                <span className="font-bold text-gray-400 mt-2 text-center px-4">Toque para tirar foto do local de instalação</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
              {files.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {files.map((f, i) => (
                    <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-gray-100">
                      <img src={f.preview} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#003B73]">Sua Localização</h2>
              <p className="text-gray-500 font-medium">Precisamos saber onde entregar.</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
              <button 
                type="button"
                onClick={captureLocation}
                disabled={locationLoading}
                className="w-full p-6 bg-[#0077B6] text-white font-bold rounded-2xl flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${locationLoading ? 'bg-white/20' : 'bg-white text-[#0077B6]'}`}>
                  <MapPin className={`w-6 h-6 ${locationLoading ? 'animate-bounce' : ''}`} />
                </div>
                {locationLoading ? "Obtendo localização..." : "Enviar minha localização atual"}
              </button>
              {watchAll.maps_link && (
                <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-3 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-bold">Localização capturada!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </FormLayout>
    </form>
  );
}
