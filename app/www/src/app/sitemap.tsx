import { MetadataRoute } from "next";
import { source } from "@/lib/source";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = source.getPages();

  return [
    {
      url: "/",
      lastModified: new Date(),
    },
    {
      url: "/plugins",
      lastModified: new Date(),
    },
    ...blogs.map((blog) => ({
      url: blog.url,
      lastModified: blog.data.updatedAt,
    })),
  ];
}
