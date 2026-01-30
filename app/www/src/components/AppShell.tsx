"use client";

import { AppNavbar } from "@/components/AppNavbar";
import { MobileMenuProvider } from "@/components/MobileMenuContext";
import { AppMobileMenu } from "@/components/AppMobileMenu";
import { SearchProvider } from "@/components/search/SearchProvider";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchProvider>
      <MobileMenuProvider>
        <div className="min-h-screen bg-background overflow-x-clip">
          {/* Background decorations */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -left-32 w-150 h-150 bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/3 right-0 w-125 h-125 bg-primary/8 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-1/3 w-175 h-100 bg-primary/6 rounded-full blur-[140px]" />
          </div>

          <AppNavbar />
          <AppMobileMenu />

          {children}
        </div>
      </MobileMenuProvider>
    </SearchProvider>
  );
}
