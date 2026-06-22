import type { ProductGroup } from "@/modules/products/products-catalogs.schema"

import type { GroupsDraftFilters } from "./groups-constants"

export function filterProductGroups(
  items: ProductGroup[],
  criteria: GroupsDraftFilters
): ProductGroup[] {
  const term = criteria.description.trim().toLowerCase()
  if (!term) return items

  return items.filter((item) =>
    item.description.toLowerCase().includes(term)
  )
}
