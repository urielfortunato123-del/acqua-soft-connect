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
    <div className="fixed top-[12px] right-[12px] z-[9999]">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <Button
          onClick={handleShare}
          className="bg-white text-[#003B73] border border-gray-100 shadow-md rounded-[20px] h-[40px] px-3 flex items-center gap-2 font-bold text-[14px] transition-all duration-200 w-fit hover:bg-white"
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
          <span className="hidden min-[480px]:inline">Compartilhar</span>
        </Button>
      </motion.div>
    </div>
  );
};
