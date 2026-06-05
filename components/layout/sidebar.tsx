"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, Info, ShieldCheck } from "lucide-react";
import { navItems } from "./nav-items";

const REPO_URL = "https://github.com/Fischer-Product-Lab/trustdesk";

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-2 px-4 py-5">
      {/* Brand */}
      <Link
        href="/"
        onClick={onNavigate}
        className="group flex items-center gap-3 rounded-lg px-2 py-2"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/40 bg-gold/10 text-gold">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            TrustDesk
          </span>
          <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Fischer Product Lab
          </span>
        </span>
      </Link>

      <div className="mt-4 px-2 text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
        Trust Operations
      </div>

      {/* Nav */}
      <nav className="mt-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-surface-2 text-ink"
                  : "text-ink-muted hover:bg-surface-2/60 hover:text-ink"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gold" />
              )}
              <Icon
                className={`h-[18px] w-[18px] ${
                  active ? "text-gold" : "text-ink-faint group-hover:text-ink-muted"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto space-y-3">
        <div className="rounded-lg border border-hairline bg-surface/60 p-3 text-xs leading-relaxed text-ink-muted">
          <p className="font-medium text-ink">Read-only demo</p>
          <p className="mt-1 text-ink-faint">
            Synthetic data only. No real customer, employer, or personal data.
          </p>
        </div>
        <div className="flex flex-col gap-0.5 px-1 text-xs">
          <Link
            href="/about"
            onClick={onNavigate}
            aria-current={pathname === "/about" ? "page" : undefined}
            className={`flex items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors ${
              pathname === "/about"
                ? "text-gold"
                : "text-ink-faint hover:text-ink"
            }`}
          >
            <Info className="h-3.5 w-3.5" />
            About this demo
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-md px-1.5 py-1.5 text-ink-faint transition-colors hover:text-ink"
          >
            <Code2 className="h-3.5 w-3.5" />
            View source
          </a>
        </div>
      </div>
    </div>
  );
}
