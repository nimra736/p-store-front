import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/types/shopify";

/** Format a price amount with its currency code */
function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

interface ProductCardProps {
  product: ShopifyProduct;
  countryCode?: string;
}

export default function ProductCard({ product, countryCode }: ProductCardProps) {
  const image = product.featuredImage ?? product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange.minVariantPrice;
  const hasDiscount =
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const countryParam = countryCode && countryCode !== "US" ? `?country=${countryCode}` : "";

  return (
    <Link
      href={`/products/${product.handle}${countryParam}`}
      id={`product-${product.handle}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1"
    >
      {/* ── Image Container ─────────────────────────────────── */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}

        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg shadow-emerald-500/30">
            SALE
          </div>
        )}

        {/* Product type tag */}
        {product.productType && (
          <div className="absolute top-3 right-3 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80 backdrop-blur-md">
            {product.productType}
          </div>
        )}
      </div>

      {/* ── Product Info ──────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-semibold tracking-wide text-white/90 transition-colors group-hover:text-white">
          {product.title}
        </h3>

        {product.description && (
          <p className="text-xs leading-relaxed text-white/40 line-clamp-3">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-end gap-2 pt-3">
          <span className="text-lg font-bold tracking-tight text-white">
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-white/30 line-through">
              {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
            </span>
          )}
          <span className="ml-auto rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium tracking-wider text-white/40 uppercase">
            {price.currencyCode}
          </span>
        </div>
      </div>
    </Link>
  );
}
