import { getPlugins } from "@/lib/plugins";
import { PluginsClient } from "@/components/plugins/PluginsClient";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Plugins - Redenv",
  description:
    "Discover plugins that extend Redenv with dashboards, CI/CD integrations, security tools, and more.",
};

export default async function PluginsPage() {
  const plugins = await getPlugins();
  return <PluginsClient plugins={plugins} />;
}
