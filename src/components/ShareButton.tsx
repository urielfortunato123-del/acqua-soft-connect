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
    <div className="fixed top-6 right-6 z-[60]">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleShare}
          className="bg-white/90 backdrop-blur-md text-[#003B73] border border-white/20 shadow-xl rounded-full px-5 py-6 flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check className="w-4 h-4 text-green-500" />
              </motion.div>
            ) : (
              <motion.div
                key="share"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Share2 className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
          Compartilhar Aplicativo
        </Button>
      </motion.div>
    </div>
  );
};
