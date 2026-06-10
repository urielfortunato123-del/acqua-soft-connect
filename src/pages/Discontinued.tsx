import { AlertCircle } from "lucide-react";

const DiscontinuedPage = () => {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-zinc-950 text-white p-6 overflow-hidden">
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="flex justify-center">
          <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 shadow-2xl shadow-red-500/10">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Aplicativo Descontinuado
          </h1>
          
          <div className="space-y-2">
            <p className="text-lg text-zinc-300 font-medium">
              Este aplicativo foi encerrado pelo proprietário e não está mais disponível para uso.
            </p>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Os serviços, dados e funcionalidades foram permanentemente desativados.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/50">
          <button 
            onClick={() => window.location.href = 'about:blank'}
            className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-medium rounded-xl transition-all border border-zinc-800 active:scale-95"
          >
            Sair do Aplicativo
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscontinuedPage;
