"use client";

import Link from "next/link";
import { FlaskConical, Info, Menu } from "lucide-react";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-hairline bg-canvas/80 px-4 backdrop-blur-md md:px-8">
      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation menu"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline text-ink-muted transition-colors hover:text-ink md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Wordmark (mobile only — sidebar carries it on desktop) */}
      <span className="font-display text-base font-semibold tracking-tight text-ink md:hidden">
        TrustDesk
      </span>

      <div className="ml-auto flex items-center gap-3">
        {/* Synthetic data badge — always visible, per the V1 guardrails.
            Doubles as the entry point to the "About this demo" context. */}
        <Link
          href="/about"
          title="Read-only demo on synthetic data — about this demo"
          className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-soft transition-colors hover:border-gold/70 hover:bg-gold/20"
        >
          <FlaskConical className="h-3.5 w-3.5" />
          Synthetic demo data
          <Info className="h-3.5 w-3.5 opacity-60" />
        </Link>
      </div>
    </header>
  );
}
