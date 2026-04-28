import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import { shopifyFetch } from "@/lib/shopify";
import { PRODUCTS_QUERY } from "@/lib/queries";
import type { ProductsQueryResponse, CountryCode } from "@/types/shopify";
import { SUPPORTED_LOCALES } from "@/types/shopify";

/**
 * Home Page — Server Component
 *
 * This page:
 * 1. Reads the `country` from URL search params (defaults to "US")
 * 2. Finds the matching locale config (for the language)
 * 3. Calls the Shopify Storefront API with @inContext(country, language)
 * 4. Renders the product grid with locale-aware pricing
 *
 * NOTE: mock.shop always returns CAD currency regardless of country,
 * but @inContext correctly changes the language (translations work).
 * On a real Shopify store with Markets configured, currency would change too.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  // Read locale from URL: /?country=CA
  const params = await searchParams;
  const countryCode = (params.country ?? "US") as CountryCode;

  // Find matching locale config for language
  const locale = SUPPORTED_LOCALES.find((l) => l.country === countryCode) ??
    SUPPORTED_LOCALES[0];

  // Fetch products from Shopify with @inContext
  const data = await shopifyFetch<ProductsQueryResponse>(PRODUCTS_QUERY, {
    country: locale.country,
    language: locale.language,
  });

  const products = data.products.edges;

  // Get the actual currency returned by the API
  const actualCurrency =
    products[0]?.node.priceRange.minVariantPrice.currencyCode ?? "CAD";

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        {/* ── Hero Section ─────────────────────────────────────── */}
        <section className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live from mock.shop &mdash; {locale.flag} {locale.label}
          </div>

          <h2 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Discover Our Products
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base text-white/40 leading-relaxed">
            Browsing as{" "}
            <span className="font-medium text-white/60">
              {locale.flag} {locale.label}
            </span>
            . Prices in{" "}
            <span className="font-semibold text-white/70">{actualCurrency}</span>
            . Change region to see{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs font-mono text-purple-400">
              @inContext
            </code>{" "}
            translations.
          </p>

          {/* Info banner about mock.shop */}
          {locale.country !== "US" && (
            <div className="mx-auto mt-4 max-w-lg rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-xs text-amber-200/70">
              <span className="font-semibold">💡 Note:</span> mock.shop returns{" "}
              <span className="font-mono font-bold">CAD</span> for all regions
              (no multi-currency configured). But notice the{" "}
              <span className="font-semibold text-amber-200/90">
                product titles are translated
              </span>{" "}
              &mdash; that&apos;s{" "}
              <code className="font-mono text-purple-400">@inContext</code> working!
              On a real store, currency would change too.
            </div>
          )}
        </section>

        {/* ── Product Count Badge ──────────────────────────────── */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-white/40">
            Showing{" "}
            <span className="font-medium text-white/70">{products.length}</span>{" "}
            products
          </p>
          <div className="h-px flex-1 mx-6 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="text-xs text-white/30 font-mono">
            @inContext({locale.country}, {locale.language}) &rarr; {actualCurrency}
          </p>
        </div>

        {/* ── Product Grid ─────────────────────────────────────── */}
        <ProductGrid products={products} countryCode={countryCode} />
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs text-white/20">
            Built with{" "}
            <span className="text-white/40">Next.js 15</span> &middot;{" "}
            <span className="text-white/40">Shopify Storefront API</span> &middot;{" "}
            <span className="text-white/40">Tailwind CSS</span>
          </p>
          <p className="mt-1 text-[10px] text-white/10">
            Data from mock.shop &mdash; Shopify&apos;s public test storefront
          </p>
        </div>
      </footer>
    </>
  );
}
