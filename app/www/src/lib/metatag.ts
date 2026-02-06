import { CURRENT_URL_HEADER } from "@/config";
import { Metadata } from "next";
import { headers } from "next/headers";
import { getOrigin } from "./url";

export const metatag = async ({
  title,
  robots = "index, follow",
  keywords = [],
  image,
  description,
}: {
  title: string;
  robots?: string;
  keywords?: string[];
  image?: string;
  description?: string;
}) => {
  const headersList = await headers();
  const url = headersList.get(CURRENT_URL_HEADER);
  const fav = image || `/favicons/favicon-512x512.png`;

  const fixedKeywords = [
    "redenv",
    "redenv studio",
    "env management",
    "secret management",
    "redis",
    ".env",
    "dotenv",
    "upstash",
  ];

  const margedkeywords = fixedKeywords.concat(keywords);

  const m: Metadata = {
    title: title,
    keywords: margedkeywords,
    openGraph: {
      title: title,
      url: url!,
      siteName: title,
      images: [
        {
          url: fav,
        },
      ],
      locale: "en-US",
      type: "website",
    },
    twitter: {
      title: title,
      creator: "@imprassamin",
      images: fav,
      card: "summary_large_image",
    },
    alternates: {
      canonical: url,
      languages: { "en-US": url },
    },
    robots: robots,
  };

  if (description) {
    m.description = description;
    m.twitter!.description = description;
    m.openGraph!.description = description;
  }
  return m;
};
