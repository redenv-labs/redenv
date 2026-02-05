"use client";

import { Link } from "@/components/Link";
import { BookOpen, FileText, ExternalLink } from "lucide-react";
import { Github } from "./icons/Github";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { REDENV_GITHUB_URL, REDENV_LABS_URL } from "@/consts";
import { RedenvLabsLogo } from "./icons/RedenvLabsLogo";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/docs", label: "Docs", icon: BookOpen, disabled: false },
    { href: "/plugins", label: "Plugins", icon: BookOpen, disabled: false },
    { href: "/changelog", label: "Changelog", icon: FileText, disabled: true },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-[padding] duration-500 ease-out ${
          isScrolled ? "pt-4 px-4" : "pt-0 px-0"
        }`}
      >
        <motion.div
          layout
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className={`w-full transition-[max-width,background-color,backdrop-filter,border-radius,box-shadow,padding] duration-500 ease-out border-white/10 ${
            isScrolled
              ? "max-w-5xl bg-background/10 backdrop-blur-2xl border rounded-2xl shadow-2xl shadow-black/50"
              : "max-w-full bg-transparent"
          }`}
        >
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              isScrolled ? "px-4 py-3" : "px-6 py-6 max-w-7xl mx-auto"
            }`}
          >
            {/* Logo */}
            <div className="flex items-center gap-4">
              <Link
                target="_blank"
                rel="noopener noreferrer"
                href={REDENV_LABS_URL}
                className="flex items-center gap-2 group"
              >
                <div className="flex items-center justify-center w-6 h-6 text-white/80 group-hover:text-white transition-colors">
                  <RedenvLabsLogo />
                </div>
                <span className="sr-only">Redenv Labs</span>
              </Link>

              <div className="w-px h-6 rotate-20 bg-white/10" />

              <Link href="/" className="flex items-center gap-2 group">
                <span className="font-bold text-lg text-white  transition-colors tracking-tight">
                  redenv
                </span>
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-6">
              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                {navLinks
                  .filter((item) => !item.disabled)
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
              </nav>

              {/* Separator */}
              <div className="hidden md:block w-px h-5 bg-white/10" />

              {/* GitHub */}
              <Link
                href={REDENV_GITHUB_URL}
                target="_blank"
                className="text-white/50 hover:text-white transition-colors flex items-center justify-center w-9 h-9 rounded-lg hover:bg-white/5"
              >
                <Github size={18} />
              </Link>
              <button
                ref={menuButtonRef}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white/60 hover:text-white transition-colors w-9 h-9 flex flex-col items-center justify-center gap-1 rounded-lg hover:bg-white/5"
                aria-label="Toggle menu"
              >
                <span
                  className={`block w-4 h-0.5 bg-current rounded-full transition-all duration-300 ease-out ${
                    isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`block w-3 h-0.5 bg-current rounded-full transition-all duration-300 ease-out ${
                    isMobileMenuOpen ? "opacity-0 scale-0" : ""
                  }`}
                />
                <span
                  className={`block w-4 h-0.5 bg-current rounded-full transition-all duration-300 ease-out ${
                    isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-0 top-20 z-40 mx-4 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden md:hidden"
            >
              {/* Nav Links */}
              <nav className="p-3 space-y-1">
                {navLinks
                  .filter((item) => !item.disabled)
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
                    >
                      <item.icon size={18} className="text-white/40" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  ))}

                <div className="pt-2 border-t border-white/5 mt-2">
                  <Link
                    href="https://github.com/redenv-labs/redenv"
                    target="_blank"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
                  >
                    <Github size={18} className="text-white/40" />
                    <span className="font-medium">GitHub</span>
                    <ExternalLink size={14} className="ml-auto text-white/30" />
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
