// ─── Shopify Storefront API Type Definitions ──────────────────────────────────

/** Money amount with currency code */
export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

/** Price range for a product (min/max variant prices) */
export interface ProductPriceRange {
  minVariantPrice: MoneyV2;
  maxVariantPrice: MoneyV2;
}

/** Shopify image node */
export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

/** A single product from the Storefront API */
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  priceRange: ProductPriceRange;
  compareAtPriceRange: ProductPriceRange;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  featuredImage: ShopifyImage | null;
}

/** GraphQL edge wrapper */
export interface ProductEdge {
  node: ShopifyProduct;
}

/** GraphQL connection wrapper */
export interface ProductConnection {
  edges: ProductEdge[];
}

/** The shape of the products query response */
export interface ProductsQueryResponse {
  products: ProductConnection;
}

/** Variant of a product */
export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: MoneyV2;
  compareAtPrice: MoneyV2 | null;
}

/** Extended product with variants and extra fields (for detail page) */
export interface ShopifyProductDetail extends ShopifyProduct {
  descriptionHtml: string;
  vendor: string;
  tags: string[];
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
}

/** The shape of the single product query response */
export interface ProductQueryResponse {
  product: ShopifyProductDetail | null;
}

/** A collection from the Storefront API */
export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
  products: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        featuredImage: ShopifyImage | null;
        priceRange: {
          minVariantPrice: MoneyV2;
        };
      };
    }>;
  };
}

/** The shape of the collections query response */
export interface CollectionsQueryResponse {
  collections: {
    edges: Array<{
      node: ShopifyCollection;
    }>;
  };
}

// ─── Locale Types ──────────────────────────────────────────────────────────────

/** Supported country codes for @inContext directive */
export type CountryCode = "US" | "CA" | "GB" | "DE" | "FR" | "JP" | "AU";

/** Supported language codes */
export type LanguageCode = "EN" | "FR" | "DE" | "JA";

/** Locale configuration */
export interface LocaleConfig {
  country: CountryCode;
  language: LanguageCode;
  label: string;
  currencySymbol: string;
  flag: string;
}

/** All available locales for the store */
export const SUPPORTED_LOCALES: LocaleConfig[] = [
  { country: "US", language: "EN", label: "United States", currencySymbol: "$", flag: "🇺🇸" },
  { country: "CA", language: "EN", label: "Canada", currencySymbol: "CA$", flag: "🇨🇦" },
  { country: "GB", language: "EN", label: "United Kingdom", currencySymbol: "£", flag: "🇬🇧" },
  { country: "DE", language: "DE", label: "Germany", currencySymbol: "€", flag: "🇩🇪" },
  { country: "FR", language: "FR", label: "France", currencySymbol: "€", flag: "🇫🇷" },
  { country: "JP", language: "JA", label: "Japan", currencySymbol: "¥", flag: "🇯🇵" },
  { country: "AU", language: "EN", label: "Australia", currencySymbol: "A$", flag: "🇦🇺" },
];
