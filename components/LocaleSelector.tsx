"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { SUPPORTED_LOCALES, type CountryCode } from "@/types/shopify";

export default function LocaleSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCountry = (searchParams.get("country") ?? "US") as CountryCode;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newCountry = e.target.value;
    startTransition(() => {
      router.push(`${pathname}?country=${newCountry}`);
    });
  }

  return (
    <div className="relative flex items-center gap-2">
      {/* Loading spinner */}
      {isPending && (
        <div className="absolute -left-6">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        </div>
      )}

      <label htmlFor="locale-selector" className="sr-only">
        Select region
      </label>
      <select
        id="locale-selector"
        value={currentCountry}
        onChange={handleChange}
        disabled={isPending}
        className="cursor-pointer appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/10 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <option
            key={locale.country}
            value={locale.country}
            className="bg-zinc-900 text-white"
          >
            {locale.flag} {locale.label} ({locale.currencySymbol})
          </option>
        ))}
      </select>

      {/* Custom dropdown arrow */}
      <div className="pointer-events-none absolute right-3 text-white/40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}
