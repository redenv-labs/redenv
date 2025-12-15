import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <HeroUIProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </HeroUIProvider>
);
