import { Share2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const ShareButton = () => {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="fixed top-4 right-4 z-[9999]">
      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ 
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : -15,
          pointerEvents: isVisible ? 'auto' : 'none'
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={handleShare}
            className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md text-[#003B73] border border-gray-100 shadow-lg flex items-center justify-center p-0 transition-all duration-300 hover:bg-white"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-5 h-5 text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="share"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Share2 className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
