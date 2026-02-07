import { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { getOrigin } from "@/lib/url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = source.getPages();
  const origin = await getOrigin();

  return [
    {
      url: `${origin}/`,
      lastModified: new Date(),
    },
    {
      url: `${origin}/plugins`,
      lastModified: new Date(),
    },
    {
      url: `${origin}/changelog`,
      lastModified: new Date(),
    },
    ...blogs.map((blog) => ({
      url: `${origin}${blog.url}`,
      lastModified: blog.data.updatedAt,
    })),
  ];
}
