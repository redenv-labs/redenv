import { getPlugins } from "@/lib/plugins";
import { PluginsView } from "./view";
import { Suspense } from "react";
import { metatag } from "@/lib/metatag";

export const revalidate = 3600;

export const generateMetadata = () => {
  return metatag({
    title: "Plugins - Redenv",
    description:
      "Explore the Redenv Plugin Ecosystem. Supercharge your secret management workflow with powerful integrations and community-built tools designed to automate and extend your experience.",
  });
};

export default async function PluginsPage() {
  const plugins = await getPlugins();
  return (
    <Suspense fallback={null}>
      <PluginsView plugins={plugins} />
    </Suspense>
  );
}
