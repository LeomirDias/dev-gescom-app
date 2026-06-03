import type { ListProductsEnterprisesQuery } from "@/modules/products/products.schema"

export const PRODUCTS_BASE_PATH = "/products"
export const DEFAULT_PRODUCTS_LIMIT = 50

export function defaultProductsEnterprisesFilters(): ListProductsEnterprisesQuery {
  return {
    limit: DEFAULT_PRODUCTS_LIMIT,
    offset: 0,
  }
}
