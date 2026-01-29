import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Redenv - Secure Secret Management",
  description: "Zero-knowledge, end-to-end encrypted secret management system.",
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
