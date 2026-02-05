import "./globals.css";
import { Providers } from "@/providers/Providers";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#252525",
};

export const generateMetadata = async () => {
  const title = "Redenv - Secure Secret Management";
  const description =
    "Zero-knowledge, end-to-end encrypted secret management system.";

  return {
    icons: {
      icon: [
        { url: "/favicons/favicon-96x96.png", sizes: "96x96" },
        { url: "/favicons/favicon-192x192.png", sizes: "192x192" },
        { url: "/favicons/favicon-512x512.png", sizes: "512x512" },
        { url: "/favicons/favicon.svg" },
      ],
      shortcut: ["/favicons/favicon.svg"],
      apple: [
        {
          url: "/favicons/favicon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
    },
    manifest: "/favicons/site.webmanifest",
    publisher: "Redenv Labs",
    creator: "Redenv Labs",
    authors: [
      {
        name: "Redenv Labs",
        url: "https://github.com/redenv-labs",
      },
    ],
    appleWebApp: {
      title: "Redenv",
    },
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
  };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.className} antialiased min-h-screen bg-background text-foreground scrollbar-1 overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
