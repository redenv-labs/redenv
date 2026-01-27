"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@heroui/react";
import ShikiHighlighter from "react-shiki";
import { CopyButton } from "../CopyButton";
import { Typescript } from "../icons/Typescript";
import { Python } from "../icons/Python";
import { Npm } from "../icons/Npm";
import { PyPI } from "../icons/PyPI";
import { REDENV_JS_CLIENT_URL, REDENV_PYPI_URL } from "@/consts";

const tabs = [
  { id: "typescript", label: "TypeScript", icon: <Typescript size={14}/> },
  { id: "python", label: "Python", icon: <Python size={14}/> },
];

const codeExamples = {
  typescript: {
    setup: {
      filename: "lib/redenv.ts",
      code: `import { Redenv } from "@redenv/client";

export const redenv = new Redenv({
  project: "my-app",
  tokenId: process.env.REDENV_TOKEN_ID,
  token: process.env.REDENV_TOKEN_KEY,
  upstash: {
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  },
});`,
    },
    usage: {
      filename: "app/api/route.ts",
      code: `import { redenv } from "@/lib/redenv";

export async function GET() {
  const secrets = await redenv.load();

  const apiKey = secrets.get("API_KEY");
  const port = secrets.get("PORT").toInt();
  const debug = secrets.get("DEBUG").toBool();

  return Response.json({ status: "ok" });
}`,
    },
  },
  python: {
    setup: {
      filename: "lib/redenv.py",
      code: `from redenv import Redenv
import os

redenv = Redenv(
    project="my-app",
    token_id=os.environ["REDENV_TOKEN_ID"],
    token=os.environ["REDENV_TOKEN_KEY"],
    upstash={
        "url": os.environ["UPSTASH_REDIS_URL"],
        "token": os.environ["UPSTASH_REDIS_TOKEN"],
    },
)`,
    },
    usage: {
      filename: "main.py",
      code: `from lib.redenv import redenv

async def main():
    secrets = await redenv.load()

    api_key = secrets.get("API_KEY")
    port = secrets.get("PORT").to_int()
    debug = secrets.get("DEBUG").to_bool()

    print(f"Running on port {port}")`,
    },
  },
};

function SyntaxHighlight({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  return (
    <div className="font-mono text-[13px] leading-relaxed text-white/60">
      <ShikiHighlighter
        language={language}
        theme={"github-dark"}
        showLanguage={false}
        className="[&_pre]:bg-transparent!"
      >
        {code.trim()}
      </ShikiHighlighter>
    </div>
  );
}

function CodeBlock({
  filename,
  code,
  language,
}: {
  filename: string;
  code: string;
  language: string;
}) {
  return (
    <div className="bg-[#0a0a0a] border border-white/8 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pl-4 pr-2 py-1.5 border-b border-white/5 bg-white/2">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
          </div>
          <span className="text-xs text-white/40">{filename}</span>
        </div>
        <CopyButton text={code} />
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <SyntaxHighlight code={code} language={language} />
      </div>
    </div>
  );
}

export function SDKShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState("typescript");

  const currentExample = codeExamples[activeTab as keyof typeof codeExamples];

  return (
    <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(59,130,246,0.06),transparent)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/3 mb-6">
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
              Multi Language SDKs
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Works with your stack
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            First-class support for TypeScript and Python. More coming soon.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-white/3 border border-white/8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                  activeTab === tab.id
                    ? "text-white"
                    : "text-white/50 hover:text-white/70",
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-lg"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <span
                    className={cn(
                      "w-6 h-6 rounded flex items-center justify-center transition-colors duration-200",
                      activeTab === tab.id
                        ? tab.id === "typescript"
                          ? "text-[#3178C6]"
                          : "text-[#FFE873]"
                        : "text-white/50",
                    )}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Code Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Setup */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">
                1
              </div>
              <span className="text-sm text-white/60">Initialize once</span>
            </div>
            <CodeBlock
              filename={currentExample.setup.filename}
              code={currentExample.setup.code}
              language={activeTab}
            />
          </div>

          {/* Usage */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
                2
              </div>
              <span className="text-sm text-white/60">Use anywhere</span>
            </div>
            <CodeBlock
              filename={currentExample.usage.filename}
              code={currentExample.usage.code}
              language={activeTab}
            />
          </div>
        </motion.div>

        {/* Package links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center gap-4 mt-8"
        >
          <a
            href={REDENV_JS_CLIENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/3 border border-white/8 text-sm text-white/50 hover:text-white/70 hover:border-white/20 transition-colors"
          >
            <Npm size={16}/>
            @redenv/client
          </a>
          <a
            href={REDENV_PYPI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/3 border border-white/8 text-sm text-white/50 hover:text-white/70 hover:border-white/20 transition-colors"
          >
           <PyPI size={16}/>
            redenv
          </a>
        </motion.div>
      </div>
    </section>
  );
}
