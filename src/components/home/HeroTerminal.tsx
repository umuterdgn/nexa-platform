"use client";

import { useState, useEffect } from "react";
import { Terminal, CheckCircle2 } from "lucide-react";

const TERMINAL_LINES = [
  "> npx nexa-deploy --production",
  "> Compiling enterprise logic...",
  "> System architecture online.",
];

export function HeroTerminal() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  useEffect(() => {
    if (currentLineIndex >= TERMINAL_LINES.length) {
      // Loop after a pause
      const resetTimeout = setTimeout(() => {
        setDisplayedLines([]);
        setCurrentLineIndex(0);
        setCurrentCharIndex(0);
      }, 4000);
      return () => clearTimeout(resetTimeout);
    }

    const targetLine = TERMINAL_LINES[currentLineIndex];

    if (currentCharIndex < targetLine.length) {
      const typeTimeout = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, 35);
      return () => clearTimeout(typeTimeout);
    } else {
      // Line finished
      const nextLineTimeout = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, targetLine]);
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 450);
      return () => clearTimeout(nextLineTimeout);
    }
  }, [currentLineIndex, currentCharIndex]);

  const currentlyTyping =
    currentLineIndex < TERMINAL_LINES.length
      ? TERMINAL_LINES[currentLineIndex].slice(0, currentCharIndex)
      : "";

  return (
    <div className="relative mx-auto mt-6 w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-950/90 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl text-left font-mono text-xs">
      {/* Titlebar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-zinc-900/70 px-3.5 py-2">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-[10px] text-zinc-400">nexa-runtime-cli</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>production-ready</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 space-y-1.5 min-h-[96px] bg-gradient-to-b from-zinc-950/90 to-zinc-900/40">
        {displayedLines.map((line, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 ${
              idx === 2 ? "text-emerald-400 font-semibold" : "text-zinc-300"
            }`}
          >
            {idx === 2 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />}
            <span>{line}</span>
          </div>
        ))}

        {currentLineIndex < TERMINAL_LINES.length && (
          <div className="text-zinc-200 flex items-center">
            <span>{currentlyTyping}</span>
            <span className="inline-block w-2 h-3.5 ml-1 bg-emerald-400 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
