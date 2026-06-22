"use client"

import { useQuery } from "@tanstack/react-query"

import { CACHE } from "@/lib/react-query/cache-policy"
import { useActiveEnterpriseId } from "@/lib/tenant/use-active-enterprise-id"
import { resolveProductIdsByLocationTerm } from "@/modules/products/products-location-filter"

export function useProductsLocationProductIds({
  locacao,
  enabled = true,
}: {
  locacao: string | undefined
  enabled?: boolean
}) {
  const enterpriseId = useActiveEnterpriseId()
  const term = locacao?.trim()

  return useQuery({
    queryKey: ["products", enterpriseId, "location-product-ids", term],
    queryFn: ({ signal }) => resolveProductIdsByLocationTerm(term!, { signal }),
    enabled: enabled && Boolean(enterpriseId) && Boolean(term),
    staleTime: CACHE.tenantDetail,
  })
}
