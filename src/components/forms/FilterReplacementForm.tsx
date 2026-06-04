import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormLayout } from "./FormLayout";
import { Camera, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function FilterReplacementForm() {
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
      modelo: "Soft Fit",
      ultima_troca: "6 meses",
      visita_tecnica: "Sim",
    }
  });

  const watchAll = watch();

  const onSubmit = (data: any) => {
    setLoading(true);
    let message = `*SOLICITAÇÃO DE TROCA DE REFIL*\n\n`;
    message += `*DADOS DO CLIENTE*\n`;
    message += `*Nome:* ${data.nome}\n`;
    message += `*WhatsApp:* ${data.whatsapp}\n`;
    message += `*Cidade:* ${data.cidade}\n`;
    message += `*Bairro:* ${data.bairro}\n\n`;
    
    message += `*DADOS DO EQUIPAMENTO*\n`;
    message += `*Modelo:* ${data.modelo}\n`;
    message += `*Última troca:* ${data.ultima_troca}\n`;
    message += `*Deseja visita técnica:* ${data.visita_tecnica}\n`;
    
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
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormLayout
        title="Troca de Refil"
        step={step}
        totalSteps={5}
        onPrev={prevStep}
        onNext={nextStep}
        isLastStep={step === 5}
        isLoading={loading}
        isValid={isStepValid()}
      >
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#003B73]">Dados de Contato</h2>
              <p className="text-gray-500 font-medium">Preencha seus dados para agendamento.</p>
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
              <h2 className="text-2xl font-extrabold text-[#003B73]">Modelo do Purificador</h2>
              <p className="text-gray-500 font-medium">Qual modelo você possui?</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 grid grid-cols-1 gap-3">
              {["Soft Baby", "Soft Fit", "Soft Slim", "Soft Everest", "Soft Star", "Outro"].map(opt => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setValue("modelo", opt)}
                  className={`w-full p-4 rounded-2xl font-bold text-left transition-all ${watchAll.modelo === opt ? 'bg-[#003B73] text-white' : 'bg-gray-50 text-gray-500'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#003B73]">Última Troca</h2>
              <p className="text-gray-500 font-medium">Quando foi a última vez que trocou o refil?</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 grid grid-cols-1 gap-3">
              {["Menos de 6 meses", "6 meses", "1 ano", "Mais de 1 ano", "Não sei informar"].map(opt => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setValue("ultima_troca", opt)}
                  className={`w-full p-4 rounded-2xl font-bold text-left transition-all ${watchAll.ultima_troca === opt ? 'bg-[#003B73] text-white' : 'bg-gray-50 text-gray-500'}`}
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
              <h2 className="text-2xl font-extrabold text-[#003B73]">Visita Técnica</h2>
              <p className="text-gray-500 font-medium">Deseja que um técnico realize a troca?</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
              {["Sim", "Não"].map(opt => (
                <button 
                  key={opt}
                  type="button"
                  onClick={() => setValue("visita_tecnica", opt)}
                  className={`w-full p-6 rounded-[2rem] font-bold transition-all flex flex-col items-center gap-3 ${watchAll.visita_tecnica === opt ? 'bg-[#003B73] text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-400'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${watchAll.visita_tecnica === opt ? 'bg-white/20' : 'bg-gray-200'}`}>
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#003B73]">Foto do Equipamento</h2>
              <p className="text-gray-500 font-medium">Opcional: tire uma foto do seu purificador.</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-4">
              <label className="w-full aspect-video bg-gray-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-[#0077B6] cursor-pointer transition-all">
                <Camera className="w-10 h-10 text-gray-300" />
                <span className="font-bold text-gray-400 mt-2">Toque para tirar foto</span>
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
      </FormLayout>
    </form>
  );
}
