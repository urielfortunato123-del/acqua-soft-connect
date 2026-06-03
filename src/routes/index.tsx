import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { User, UserPlus, Info } from "lucide-react";

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

  return (
    <div className="p-6 max-w-md mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-primary">
          Como podemos ajudar você hoje?
        </h1>
        <p className="text-muted-foreground">
          Escolha uma das opções abaixo para iniciar seu atendimento.
        </p>
      </div>

      {step === 'welcome' ? (
        <div className="grid gap-4">
          <button 
            onClick={() => handleSelectClientType('client')}
            className="btn-primary h-24"
          >
            <User className="w-6 h-6" />
            Sou Cliente
          </button>
          <button 
            onClick={() => handleSelectClientType('new')}
            className="btn-secondary h-24"
          >
            <UserPlus className="w-6 h-6" />
            Não Sou Cliente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleServiceSelect('orcamento')} className="card-service">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <span className="text-2xl font-bold">$</span>
            </div>
            <span className="font-semibold text-sm">Solicitar Orçamento</span>
          </button>
          
          <button onClick={() => handleServiceSelect('refil')} className="card-service">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <Info className="w-6 h-6" />
            </div>
            <span className="font-semibold text-sm">Troca de Refil</span>
          </button>

          <button onClick={() => handleServiceSelect('suporte')} className="card-service">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <span className="text-2xl">🔧</span>
            </div>
            <span className="font-semibold text-sm">Suporte Técnico</span>
          </button>

          <button onClick={() => handleServiceSelect('manutencao')} className="card-service">
            <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
              <span className="text-2xl">⚡</span>
            </div>
            <span className="font-semibold text-sm">Manutenção Preventiva</span>
          </button>

          <button 
            onClick={() => setStep('welcome')}
            className="col-span-2 text-sm text-primary font-medium mt-4 underline"
          >
            Voltar
          </button>
        </div>
      )}
    </div>
  );
}
