import Link from "next/link";
import { Suspense } from "react";
import LocaleSelector from "./LocaleSelector";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* ── Logo / Brand ──────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white shadow-lg shadow-purple-500/25">
            S
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">
              Storefront
            </h1>
            <p className="text-[10px] font-medium tracking-wider text-white/30 uppercase">
              Powered by Shopify
            </p>
          </div>
        </Link>

        {/* ── Navigation ─────────────────────────────────────── */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            Products
          </Link>
          <Link
            href="/collections"
            className="text-sm font-medium text-white/60 transition-colors hover:text-white"
          >
            Collections
          </Link>
        </nav>

        {/* ── Locale Selector ────────────────────────────────── */}
        <Suspense
          fallback={
            <div className="h-10 w-48 animate-pulse rounded-xl bg-white/5" />
          }
        >
          <LocaleSelector />
        </Suspense>
      </div>
    </header>
  );
}
