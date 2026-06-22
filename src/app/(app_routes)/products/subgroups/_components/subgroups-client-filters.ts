import type { ProductSubgroup } from "@/modules/products/products-catalogs.schema"

import type { SubgroupsDraftFilters } from "./subgroups-constants"

export function filterProductSubgroups(
  items: ProductSubgroup[],
  criteria: SubgroupsDraftFilters
): ProductSubgroup[] {
  const term = criteria.description.trim().toLowerCase()
  if (!term) return items

  return items.filter((item) =>
    item.description.toLowerCase().includes(term)
  )
}
