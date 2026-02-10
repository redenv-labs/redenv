"use client";

import { Button } from "@heroui/react";
import Link from "next/link";
import { Home, Lock, FileQuestion } from "lucide-react";
import { motion } from "framer-motion";
import { GridBeams } from "@/components/GridBeams";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col font-sans selection:bg-primary/30">
      <Navbar />

      <main className="flex-1 relative flex flex-col items-center justify-center p-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <GridBeams className="opacity-40" color="#ff3333" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)]" />
        </div>

        <div className="relative z-10 max-w-2xl w-full text-center space-y-8 h-dvh flex flex-col items-center justify-center">
          {/* Glitch 404 */}
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-[12rem] leading-none font-black text-transparent bg-clip-text bg-linear-to-b from-white/10 to-transparent select-none"
            >
              404
            </motion.h1>
          </div>

          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-white tracking-tight"
            >
              This secret does not exist.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-white/40 max-w-md mx-auto"
            >
              The page you are looking for might have been moved, deleted, or is
              encrypted beyond recognition.
            </motion.p>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              as={Link}
              href="/"
              size="lg"
              className="font-medium bg-white text-black hover:bg-white/90 rounded-full px-8"
              startContent={<Home size={18} />}
            >
              Return Home
            </Button>
            <Button
              as={Link}
              href="/docs"
              size="lg"
              variant="bordered"
              className="font-medium text-white border-white/10 hover:bg-white/5 rounded-full px-8"
              startContent={<FileQuestion size={18} />}
            >
              View Documentation
            </Button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
