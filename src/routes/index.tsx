import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { User, UserPlus, CheckCircle2, ShieldCheck, Zap, Wrench } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'welcome' | 'type'>('welcome');
  const [clientType, setClientType] = useState<'client' | 'new' | null>(null);

  const handleSelectClientType = (type: 'client' | 'new') => {
    setClientType(type);
    setStep('type');
  };

  const handleServiceSelect = (service: string) => {
    navigate({
      to: "/atendimento",
      search: {
        tipo: service,
        cliente: clientType === 'client' ? 'sim' : 'nao'
      }
    });
  };

  const trustBadges = [
    { icon: Zap, label: "Atendimento rápido" },
    { icon: Wrench, label: "Suporte especializado" },
    { icon: ShieldCheck, label: "Instalação profissional" },
    { icon: CheckCircle2, label: "Jaú e região" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#003366] to-[#00AEEF] text-white pt-8 pb-16 px-6 rounded-b-[2rem] shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="bg-white p-2 rounded-2xl shadow-lg">
            <img 
              src="https://res.cloudinary.com/dcii6r5op/image/upload/v1780513779/promaxx/brm9x7wmlgi4r2oizt7i.png" 
              alt="Acqua Soft Logo" 
              className="h-16 w-auto" 
            />
          </div>
        </div>
        {/* Removido o nome de texto para manter apenas a logo */}
        <p className="text-blue-100 text-center mb-8">Soluções em Purificação de Água</p>

        
        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3">
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <badge.icon className="w-4 h-4 text-blue-200" />
              <span className="text-xs font-medium">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
            {step === 'welcome' ? 'Como podemos te ajudar?' : 'Escolha o serviço'}
          </h2>

          {step === 'welcome' ? (
            <div className="grid gap-4">
              <button 
                onClick={() => handleSelectClientType('client')}
                className="group flex items-center justify-between p-6 bg-gray-50 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200 rounded-2xl transition-all duration-300 active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Sou Cliente</p>
                    <p className="text-sm text-gray-500">Já possuo um purificador</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => handleSelectClientType('new')}
                className="group flex items-center justify-between p-6 bg-gray-50 hover:bg-blue-50 border-2 border-transparent hover:border-blue-200 rounded-2xl transition-all duration-300 active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">Não Sou Cliente</p>
                    <p className="text-sm text-gray-500">Quero conhecer os produtos</p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'orcamento', label: 'Orçamento', color: 'blue' },
                { id: 'refil', label: 'Troca Refil', color: 'green' },
                { id: 'suporte', label: 'Suporte', color: 'red' },
                { id: 'manutencao', label: 'Preventiva', color: 'yellow' },
              ].map((service) => (
                <button 
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className="card-service py-8 hover:bg-gray-50 active:scale-[0.97]"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-${service.color}-100 flex items-center justify-center text-${service.color}-600 mb-3`}>
                    {service.id === 'orcamento' && <span className="font-bold text-xl">$</span>}
                    {service.id === 'refil' && <Zap className="w-6 h-6" />}
                    {service.id === 'suporte' && <Wrench className="w-6 h-6" />}
                    {service.id === 'manutencao' && <ShieldCheck className="w-6 h-6" />}
                  </div>
                  <span className="font-bold text-sm text-gray-900">{service.label}</span>
                </button>
              ))}
              <button 
                onClick={() => setStep('welcome')}
                className="col-span-2 text-sm text-gray-400 font-medium py-4 hover:text-gray-600"
              >
                Voltar para início
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
