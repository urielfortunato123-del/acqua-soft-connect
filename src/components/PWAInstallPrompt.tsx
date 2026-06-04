import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Globe } from 'lucide-react';
import { Button } from './ui/button';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      
      // Check if we've already shown it this session or if it's already installed
      const hasSeenPrompt = sessionStorage.getItem('pwa-prompt-seen');
      if (!hasSeenPrompt) {
        // Show the prompt after a short delay
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setIsVisible(false);
    sessionStorage.setItem('pwa-prompt-seen', 'true');
  };

  const handleDecline = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa-prompt-seen', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8 sm:items-center sm:pb-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-gray-100"
          >
            <div className="relative p-6">
              <button 
                onClick={handleDecline}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center p-2 border border-blue-100 shadow-sm">
                  <img 
                    src="https://res.cloudinary.com/dcii6r5op/image/upload/v1780573444/promaxx/phxku1jfhtzl6g0wl748.png" 
                    alt="Acqua Soft" 
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-[#003B73] tracking-tight">
                    Instalar Aplicativo
                  </h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">
                    Instale o aplicativo Acqua Soft em seu celular para um acesso mais rápido e profissional.
                  </p>
                </div>

                <div className="grid grid-cols-1 w-full gap-3 pt-2">
                  <Button 
                    onClick={handleInstall}
                    className="w-full h-14 bg-[#003B73] hover:bg-[#002B53] text-white rounded-2xl font-bold text-base shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-5 h-5" />
                    Instalar Aplicativo
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    onClick={handleDecline}
                    className="w-full h-12 text-gray-400 font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    Continuar no Navegador
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
