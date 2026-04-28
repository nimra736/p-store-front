import type { ProductEdge } from "@/types/shopify";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: ProductEdge[];
  countryCode?: string;
}

export default function ProductGrid({ products, countryCode }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 text-6xl">🛍️</div>
        <h2 className="text-xl font-semibold text-white/70">
          No products found
        </h2>
        <p className="mt-1 text-sm text-white/40">
          Try selecting a different region
        </p>
      </div>
    );
  }

  return (
    <div
      id="product-grid"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map(({ node }) => (
        <ProductCard key={node.id} product={node} countryCode={countryCode} />
      ))}
    </div>
  );
}
