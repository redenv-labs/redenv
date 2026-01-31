import { getPlugins } from "@/lib/plugins";
import { PluginsView } from "./view";
import type { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Plugins - Redenv",
  description:
    "Discover plugins that extend Redenv with dashboards, CI/CD integrations, security tools, and more.",
};

export default async function PluginsPage() {
  const plugins = await getPlugins();
  return (
    <Suspense fallback={null}>
      <PluginsView plugins={plugins} />
    </Suspense>
  );
}
