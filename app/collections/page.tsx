import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { shopifyFetch } from "@/lib/shopify";
import { COLLECTIONS_QUERY } from "@/lib/queries";
import type { CollectionsQueryResponse, CountryCode } from "@/types/shopify";
import { SUPPORTED_LOCALES } from "@/types/shopify";

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const params = await searchParams;
  const countryCode = (params.country ?? "US") as CountryCode;

  const locale =
    SUPPORTED_LOCALES.find((l) => l.country === countryCode) ??
    SUPPORTED_LOCALES[0];

  const data = await shopifyFetch<CollectionsQueryResponse>(COLLECTIONS_QUERY, {
    country: locale.country,
    language: locale.language,
  });

  const collections = data.collections.edges;
  const countryParam = countryCode !== "US" ? `?country=${countryCode}` : "";

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        {/* Hero */}
        <section className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/60 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            Collections &mdash; {locale.flag} {locale.label}
          </div>

          <h2 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Browse Collections
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base text-white/40 leading-relaxed">
            Explore curated product collections from our store.
          </p>
        </section>

        {/* Collection count */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-white/40">
            Showing{" "}
            <span className="font-medium text-white/70">
              {collections.length}
            </span>{" "}
            collections
          </p>
          <div className="h-px flex-1 mx-6 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Collections grid */}
        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-6xl">📦</div>
            <h2 className="text-xl font-semibold text-white/70">
              No collections found
            </h2>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map(({ node: collection }) => (
              <Link
                key={collection.id}
                href={`/${countryParam}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1"
              >
                {/* Collection image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800">
                  {collection.image ? (
                    <Image
                      src={collection.image.url}
                      alt={collection.image.altText ?? collection.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : collection.products.edges[0]?.node.featuredImage ? (
                    <Image
                      src={collection.products.edges[0].node.featuredImage.url}
                      alt={collection.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white/20">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="3"
                          rx="2"
                          ry="2"
                        />
                        <path d="M3 9h18M9 21V9" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Product count badge */}
                  <div className="absolute bottom-3 right-3 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
                    {collection.products.edges.length} products
                  </div>
                </div>

                {/* Collection info */}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="text-lg font-semibold tracking-wide text-white/90 transition-colors group-hover:text-white">
                    {collection.title}
                  </h3>
                  {collection.description && (
                    <p className="text-xs leading-relaxed text-white/40 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs text-white/20">
            Built with <span className="text-white/40">Next.js 15</span>{" "}
            &middot;{" "}
            <span className="text-white/40">Shopify Storefront API</span>{" "}
            &middot; <span className="text-white/40">Tailwind CSS</span>
          </p>
        </div>
      </footer>
    </>
  );
}
