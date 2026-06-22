import type { ProductNcm } from "@/modules/products/products-catalogs.schema"

import type { NcmDraftFilters } from "./ncm-constants"

export function filterProductNcm(
  items: ProductNcm[],
  criteria: NcmDraftFilters
): ProductNcm[] {
  const ncmTerm = criteria.ncm.trim().toLowerCase()
  const descriptionTerm = criteria.description.trim().toLowerCase()

  if (!ncmTerm && !descriptionTerm) return items

  return items.filter((item) => {
    const matchesNcm =
      !ncmTerm || item.ncm.toLowerCase().includes(ncmTerm)
    const matchesDescription =
      !descriptionTerm ||
      item.description.toLowerCase().includes(descriptionTerm)

    return matchesNcm && matchesDescription
  })
}
