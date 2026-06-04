import { Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const ShareButton = () => {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title: 'Acqua Soft Atendimento',
    text: 'Solicite suporte, orçamento ou troca de refil para seu purificador.',
    url: 'https://acqua-soft-jau.onrender.com',
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
          fallbackCopy();
        }
      }
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    navigator.clipboard.writeText(shareData.url);
    setCopied(true);
    toast.success('Link copiado para a área de transferência!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] safe-top safe-right">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleShare}
          className="bg-white/90 backdrop-blur-md text-[#003B73] border border-white/40 shadow-lg rounded-full h-10 md:h-12 w-auto px-4 flex items-center gap-2 font-bold text-[11px] uppercase tracking-wider transition-all duration-300 hover:shadow-xl"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="w-3.5 h-3.5 text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="share"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Share2 className="w-3.5 h-3.5" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="hidden sm:inline">Compartilhar Aplicativo</span>
          <span className="sm:hidden">Compartilhar</span>
        </Button>
      </motion.div>
    </div>
  );
};
