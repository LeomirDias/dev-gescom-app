import type { ProductCest } from "@/modules/products/products-catalogs.schema"

import type { CestDraftFilters } from "./cest-constants"

export function filterProductCest(
  items: ProductCest[],
  criteria: CestDraftFilters
): ProductCest[] {
  const cestTerm = criteria.cest.trim().toLowerCase()
  const descriptionTerm = criteria.description.trim().toLowerCase()

  if (!cestTerm && !descriptionTerm) return items

  return items.filter((item) => {
    const matchesCest =
      !cestTerm || item.cest.toLowerCase().includes(cestTerm)
    const matchesDescription =
      !descriptionTerm ||
      item.description.toLowerCase().includes(descriptionTerm)

    return matchesCest && matchesDescription
  })
}
