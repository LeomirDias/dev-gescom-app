import type { ProductBrand } from "@/modules/products/products-catalogs.schema"

import type { BrandsDraftFilters } from "./brands-constants"

export function filterProductBrands(
  items: ProductBrand[],
  criteria: BrandsDraftFilters
): ProductBrand[] {
  const term = criteria.description.trim().toLowerCase()
  if (!term) return items

  return items.filter((item) =>
    item.description.toLowerCase().includes(term)
  )
}
