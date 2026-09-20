"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { api } from "@/lib/api";
import { installMockApi } from "@/mocks/install-mock-api";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
          mutations: { retry: false },
        },
      }),
  );
  const [ready, setReady] = useState(process.env.NEXT_PUBLIC_API_MODE === "remote");

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_API_MODE !== "remote") {
      installMockApi(api.http);
    }
    setReady(true);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {ready ? (
          children
        ) : (
          <div className="grid min-h-screen place-items-center p-8">Đang khởi tạo storeX…</div>
        )}
      </ToastProvider>
    </QueryClientProvider>
  );
}
