"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar — persistent */}
      <aside className="hidden w-64 shrink-0 border-r border-hairline bg-surface/40 md:block">
        <div className="sticky top-0 h-dvh">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile sidebar — slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeMobile}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-hairline bg-surface shadow-2xl">
            <button
              type="button"
              onClick={closeMobile}
              aria-label="Close navigation menu"
              className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={closeMobile} />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-10">{children}</main>
      </div>
    </div>
  );
}
