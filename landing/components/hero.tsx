"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  TextAa,
  Translate,
  NotePencil,
  Gear,
  CaretRight,
  ArrowElbowDownLeft,
} from "@phosphor-icons/react";
import Image from "next/image";

const NOISE_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

type MockOption = {
  id: string;
  label: string;
  icon: typeof TextAa;
  hint?: string;
  hasArrow?: boolean;
};

const mockOptions: MockOption[] = [
  { id: "correct", label: "Correct & improve", icon: TextAa },
  { id: "translate", label: "Translate", icon: Translate, hasArrow: true },
  { id: "note", label: "Save as note", icon: NotePencil, hint: "Local only" },
  { id: "settings", label: "Settings", icon: Gear },
];

function Noise() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-xl opacity-[0.04] mix-blend-multiply"
      style={{ backgroundImage: NOISE_URL }}
    />
  );
}

function MockOptionItem({
  option,
  selected,
  onHover,
}: {
  option: MockOption;
  selected: boolean;
  onHover: () => void;
}) {
  const Icon = option.icon;
  return (
    <motion.div
      onMouseEnter={onHover}
      className="relative flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-3 text-left text-sm"
    >
      {selected && (
        <motion.div
          layoutId="mock-selection"
          transition={{ duration: 0.08, ease: "easeOut" }}
          className="absolute inset-0 rounded-xl bg-zinc-900/5"
        />
      )}
      <Icon
        size={20}
        weight="regular"
        className={`relative transition-colors ${
          selected ? "text-zinc-950" : "text-zinc-500"
        }`}
      />
      <span
        className={`relative flex-1 text-base transition-colors ${
          selected ? "text-zinc-950" : "text-zinc-500"
        }`}
      >
        {option.label}
      </span>
      {option.hint && (
        <span className="relative text-xs text-zinc-400">{option.hint}</span>
      )}
      {option.hasArrow && (
        <CaretRight
          size={14}
          weight="bold"
          className={`relative transition-colors ${
            selected ? "text-zinc-600" : "text-zinc-400"
          }`}
        />
      )}
    </motion.div>
  );
}

function PolireMock() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const text = "How do I say hello in French?";
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setQuery(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setSelected(1), 600);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-zinc-900/5 bg-white/97 shadow-xl">
      <Noise />
      {/* Search Input */}
      <div className="relative px-5 py-4">
        <div className="min-h-7 text-lg text-zinc-900 leading-7">
          {query}
          <span className="inline-block h-5 w-0.5 animate-pulse bg-zinc-400" />
        </div>
        {!query && (
          <span className="absolute top-4 left-5 text-lg text-zinc-400 leading-7">
            Write, paste, or ask anything...
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-zinc-900/8" />

      {/* Options */}
      <div className="relative flex flex-col gap-0.5 px-2 py-2">
        {mockOptions.map((option, index) => (
          <MockOptionItem
            key={option.id}
            option={option}
            selected={index === selected}
            onHover={() => setSelected(index)}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between border-zinc-900/8 border-t bg-zinc-50/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <Image
            src="/polire-mark.svg"
            alt=""
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <span className="text-base text-zinc-700">Polire</span>
          <span className="ml-1 text-xs text-zinc-400">v1.0.0</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-600">
          <span className="font-medium text-sm">close</span>
          <kbd className="flex h-5 min-w-5 items-center justify-center rounded bg-zinc-200/60 px-1.5 text-xs text-zinc-600">
            esc
          </kbd>
          <span className="px-1 text-zinc-300">|</span>
          <span className="font-medium text-sm">send</span>
          <kbd className="flex h-5 min-w-5 items-center justify-center rounded bg-zinc-200/60 px-1.5">
            <ArrowElbowDownLeft size={11} weight="bold" />
          </kbd>
        </div>
      </footer>
    </div>
  );
}

export function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 pt-20 pb-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-pretty text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Your lightweight writing assistant
        </h1>
        <p className="mx-auto max-w-xl text-balance text-lg text-muted">
          Corrections, translations, and notes. Always ready with a keyboard
          shortcut. No browser tabs, no distractions.
        </p>
      </div>

      <PolireMock />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Available for macOS, Windows, and Linux
      </p>
    </section>
  );
}
