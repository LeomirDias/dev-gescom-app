"use client"

import { useQuery } from "@tanstack/react-query"

import { PRODUCTS_CLIENT_SEARCH_LIMIT } from "@/app/(app_routes)/products/_components/products-constants"
import { CACHE, gcTimeForStaleTime } from "@/lib/react-query/cache-policy"
import { useActiveEnterpriseId } from "@/lib/tenant/use-active-enterprise-id"
import {
  filterProductEnterprises,
  type ProductsClientFilterCriteria,
} from "@/modules/products/products-client-filters"
import { productsQueryKeys } from "@/modules/products/products-query-keys"
import type {
  ListProductsEnterprisesQuery,
  ProductEnterprise,
} from "@/modules/products/products.schema"
import {
  getProductEnterpriseService,
  listProductsEnterprisesService,
} from "@/modules/products/products.service"

type PaginatedProducts = {
  items: ProductEnterprise[]
  total: number
  limit: number
  offset: number
}

export function hasApiProductFilters(
  filters: ListProductsEnterprisesQuery
): boolean {
  return Boolean(
    filters.search?.trim() ||
      filters.description?.trim() ||
      filters.code !== undefined ||
      filters.barCode?.trim() ||
      filters.manufacturer?.trim() ||
      filters.origin?.trim() ||
      filters.group?.trim() ||
      filters.subgroup?.trim() ||
      filters.brand?.trim() ||
      filters.application?.trim()
  )
}

function intersectByLocation(
  items: ProductEnterprise[],
  locationProductIds: string[]
): ProductEnterprise[] {
  const idSet = new Set(locationProductIds)
  return items.filter((item) => idSet.has(item.id))
}

async function fetchProductsByIds(
  ids: string[]
): Promise<ProductEnterprise[]> {
  if (ids.length === 0) return []

  const settled = await Promise.allSettled(
    ids.map((id) => getProductEnterpriseService(id))
  )

  return settled
    .filter(
      (result): result is PromiseFulfilledResult<ProductEnterprise> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value)
}

export function useProductsSearchQuery({
  appliedFilters,
  appliedClientCriteria,
  locationProductIds,
  locationFilterActive,
  locationResolved,
  isClientPagination,
  enabled = true,
}: {
  appliedFilters: ListProductsEnterprisesQuery
  appliedClientCriteria: ProductsClientFilterCriteria
  locationProductIds: string[] | undefined
  locationFilterActive: boolean
  locationResolved: boolean
  isClientPagination: boolean
  enabled?: boolean
}) {
  const enterpriseId = useActiveEnterpriseId()
  const staleTime = CACHE.tenantDetail
  const locationIdsKey = locationProductIds?.slice().sort().join(",") ?? null

  return useQuery({
    queryKey: [
      ...productsQueryKeys.enterprises(enterpriseId ?? "", appliedFilters),
      "search",
      appliedClientCriteria,
      locationIdsKey,
    ],
    queryFn: async (): Promise<PaginatedProducts> => {
      if (
        locationFilterActive &&
        locationProductIds !== undefined &&
        locationProductIds.length === 0
      ) {
        return {
          items: [],
          total: 0,
          limit: appliedFilters.limit ?? 50,
          offset: 0,
        }
      }

      const locacaoOnly =
        locationFilterActive &&
        locationProductIds !== undefined &&
        locationProductIds.length > 0 &&
        !hasApiProductFilters(appliedFilters)

      let items: ProductEnterprise[]

      if (locacaoOnly) {
        items = await fetchProductsByIds(locationProductIds)
      } else {
        const page = await listProductsEnterprisesService(
          isClientPagination
            ? {
                ...appliedFilters,
                offset: 0,
                limit: PRODUCTS_CLIENT_SEARCH_LIMIT,
              }
            : appliedFilters
        )
        items = page.items

        if (
          locationFilterActive &&
          locationProductIds &&
          locationProductIds.length > 0
        ) {
          items = intersectByLocation(items, locationProductIds)
        }

        if (!isClientPagination) {
          return {
            items: filterProductEnterprises(items, appliedClientCriteria),
            total: page.total,
            limit: page.limit,
            offset: page.offset,
          }
        }
      }

      const filtered = filterProductEnterprises(items, appliedClientCriteria)
      return {
        items: filtered,
        total: filtered.length,
        limit: appliedFilters.limit ?? 50,
        offset: 0,
      }
    },
    enabled:
      enabled &&
      Boolean(enterpriseId) &&
      (!locationFilterActive || locationResolved),
    staleTime,
    gcTime: gcTimeForStaleTime(staleTime),
  })
}
