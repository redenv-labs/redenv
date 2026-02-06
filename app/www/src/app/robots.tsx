import { getOrigin } from "@/lib/url";

export default async function robots() {
  const origin = await getOrigin()

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
