import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import { DemoModeBanner } from "@/components/layout/DemoModeBanner";
import { queryClient } from "./queryClient";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <OfflineBanner />
        <DemoModeBanner />
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{ duration: 5000 }}
        />
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}
