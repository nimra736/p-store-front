import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import { shopifyFetch } from "@/lib/shopify";
import { PRODUCT_BY_HANDLE_QUERY } from "@/lib/queries";
import type { ProductQueryResponse, CountryCode } from "@/types/shopify";
import { SUPPORTED_LOCALES } from "@/types/shopify";
import { notFound } from "next/navigation";

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ country?: string }>;
}) {
  const { handle } = await params;
  const { country } = await searchParams;
  const countryCode = (country ?? "US") as CountryCode;

  const locale =
    SUPPORTED_LOCALES.find((l) => l.country === countryCode) ??
    SUPPORTED_LOCALES[0];

  const data = await shopifyFetch<ProductQueryResponse>(
    PRODUCT_BY_HANDLE_QUERY,
    {
      handle,
      country: locale.country,
      language: locale.language,
    }
  );

  const product = data.product;
  if (!product) notFound();

  const images = product.images.edges.map((e) => e.node);
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange.minVariantPrice;
  const hasDiscount =
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);
  const variants = product.variants.edges.map((e) => e.node);
  const countryParam = countryCode !== "US" ? `?country=${countryCode}` : "";

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        {/* Back link */}
        <Link
          href={`/${countryParam}`}
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to products
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              {images[0] ? (
                <Image
                  src={images[0].url}
                  alt={images[0].altText ?? product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white/20">
                  No image available
                </div>
              )}
              {hasDiscount && (
                <div className="absolute top-4 left-4 rounded-full bg-emerald-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30">
                  SALE
                </div>
              )}
            </div>

            {/* Thumbnail row */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(1, 5).map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
                  >
                    <Image
                      src={img.url}
                      alt={img.altText ?? `${product.title} ${i + 2}`}
                      fill
                      sizes="(max-width: 1024px) 25vw, 12vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col gap-6">
            {/* Breadcrumb */}
            {product.productType && (
              <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/60 backdrop-blur-md">
                {product.productType}
              </span>
            )}

            <h1 className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
              {product.title}
            </h1>

            {/* Pricing */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white">
                {formatPrice(price.amount, price.currencyCode)}
              </span>
              {hasDiscount && (
                <span className="text-lg text-white/30 line-through">
                  {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
                </span>
              )}
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium tracking-wider text-white/40 uppercase">
                {price.currencyCode}
              </span>
            </div>

            {/* Vendor */}
            {product.vendor && (
              <p className="text-sm text-white/40">
                By <span className="text-white/60">{product.vendor}</span>
              </p>
            )}

            {/* Description */}
            {product.description && (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <p className="text-sm leading-relaxed text-white/50">
                  {product.description}
                </p>
              </div>
            )}

            {/* Variants */}
            {variants.length > 1 && (
              <div>
                <h3 className="mb-3 text-sm font-medium text-white/60">
                  Available Variants
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <div
                      key={variant.id}
                      className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                        variant.availableForSale
                          ? "border-white/10 bg-white/5 text-white/80 hover:border-white/20"
                          : "border-white/5 bg-white/[0.02] text-white/30 line-through"
                      }`}
                    >
                      {variant.title}
                      <span className="ml-2 text-xs text-white/40">
                        {formatPrice(variant.price.amount, variant.price.currencyCode)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/5 bg-white/[0.03] px-3 py-1 text-xs text-white/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Locale info */}
            <div className="mt-auto rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
              <p className="text-xs text-white/30 font-mono">
                @inContext({locale.country}, {locale.language}) &rarr;{" "}
                {price.currencyCode}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-xs text-white/20">
            Built with <span className="text-white/40">Next.js 15</span>{" "}
            &middot; <span className="text-white/40">Shopify Storefront API</span>{" "}
            &middot; <span className="text-white/40">Tailwind CSS</span>
          </p>
        </div>
      </footer>
    </>
  );
}
