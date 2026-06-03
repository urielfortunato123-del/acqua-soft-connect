import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import { Toaster } from "sonner";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" },
      { title: "Acqua Soft Atendimento" },
      { name: "description", content: "Solicite suporte, orçamento ou troca de refil para seu purificador Soft Everest." },
      { name: "theme-color", content: "#003366" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/icon-192.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <header className="bg-primary p-4 shadow-md flex justify-center sticky top-0 z-50">
          <img src="/lovable-uploads/605b8a0a-e377-4402-861c-5d63f9a77348.png" alt="Acqua Soft" className="h-12 object-contain" />
        </header>
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
        <footer className="p-4 text-center text-xs text-muted-foreground bg-white/50">
          <p>Acqua Soft Purificadores - Jaú/SP</p>
          <p>Rua Tenente Lopes, 1175 - Centro</p>
        </footer>
      </div>
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
