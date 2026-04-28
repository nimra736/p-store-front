// ─── Shopify Storefront API GraphQL Client ─────────────────────────────────────

/**
 * The mock.shop endpoint — a public Shopify Storefront API mock store.
 * No access token required. Supports @inContext with multiple countries.
 */
const SHOPIFY_ENDPOINT = "https://mock.shop/api";

/**
 * Generic GraphQL fetch function for the Shopify Storefront API.
 *
 * @param query    - GraphQL query string
 * @param variables - Variables to pass to the query (e.g., country, language)
 * @returns The typed data from Shopify's response
 * @throws Error if the API returns GraphQL errors or the request fails
 */
export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(SHOPIFY_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // Cache for 60 seconds, then revalidate
  });

  if (!response.ok) {
    throw new Error(
      `Shopify API request failed: ${response.status} ${response.statusText}`
    );
  }

  const json = await response.json();

  if (json.errors) {
    console.error("Shopify GraphQL Errors:", json.errors);
    throw new Error(json.errors[0]?.message ?? "Unknown GraphQL error");
  }

  return json.data as T;
}
