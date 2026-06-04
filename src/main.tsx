import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Atendimento from './pages/Atendimento';
import './styles.css';
import { registerSW } from 'virtual:pwa-register';
import { ThemeProvider } from './hooks/use-theme';

// Register service worker
registerSW({ immediate: true });

const queryClient = new QueryClient();

// Wrapper component to handle search params for Atendimento
const AtendimentoWrapper = () => {
  const [searchParams] = useSearchParams();
  const tipo = searchParams.get('tipo') || 'suporte';
  const cliente = searchParams.get('cliente') || 'nao';
  
  return <Atendimento tipo={tipo} cliente={cliente} />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
            <main className="flex-1 overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/atendimento" element={<AtendimentoWrapper />} />
                {/* Fallback for SPA routing */}
                <Route path="*" element={<Index />} />
              </Routes>
            </main>
          </div>
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
