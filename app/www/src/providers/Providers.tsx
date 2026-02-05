"use client";

import { HeroUIProvider } from "@heroui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query";
import { useRouter } from "@/hooks/useRouter";
import { Suspense } from "react";
import { Progress } from "@/components/Progress";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <RootProvider
      search={{
        enabled: false,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={null}>
          <Progress />
        </Suspense>
        <HeroUIProvider navigate={router.push}>{children}</HeroUIProvider>
        <VercelAnalytics />
        <GoogleAnalytics />
      </QueryClientProvider>
    </RootProvider>
  );
}
