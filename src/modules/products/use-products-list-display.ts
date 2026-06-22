"use client"

import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { CACHE, gcTimeForStaleTime } from "@/lib/react-query/cache-policy"
import { useOperatorPermissions } from "@/lib/permissions"
import { useActiveEnterpriseId } from "@/lib/tenant/use-active-enterprise-id"
import {
  collectMissingCatalogIds,
  enrichProductEnterpriseListItems,
} from "@/modules/products/products-list-display"
import { fetchProductsListLookups } from "@/modules/products/products-list-lookups"
import { productsQueryKeys } from "@/modules/products/products-query-keys"
import type {
  ProductEnterprise,
  ProductEnterpriseListItem,
} from "@/modules/products/products.schema"

export function useProductsListDisplayItems({
  items,
  enabled = true,
}: {
  items: ProductEnterprise[]
  enabled?: boolean
}): ProductEnterpriseListItem[] {
  const enterpriseId = useActiveEnterpriseId()
  const perms = useOperatorPermissions()
  const staleTime = CACHE.tenantList

  const includeStock =
    perms.canConsultStockLocations &&
    (perms.canConsultStockBalances || perms.canConsultStockBatchBalances)

  const baseLookupsQuery = useQuery({
    queryKey: [
      ...productsQueryKeys.enterprises(enterpriseId ?? "", {}),
      "list-display-lookups",
      {
        includeGroups: perms.canConsultProductGroups,
        includeSubgroups: perms.canConsultProductSubgroups,
        includeBrands: perms.canConsultProductBrands,
        includeApplications: perms.canConsultProductApplications,
        includeStock,
      },
    ],
    queryFn: ({ signal }) =>
      fetchProductsListLookups({
        includeGroups: perms.canConsultProductGroups,
        includeSubgroups: perms.canConsultProductSubgroups,
        includeBrands: perms.canConsultProductBrands,
        includeApplications: perms.canConsultProductApplications,
        includeStock,
        signal,
      }),
    enabled: enabled && Boolean(enterpriseId),
    staleTime,
    gcTime: gcTimeForStaleTime(staleTime),
  })

  const missingCatalogIds = useMemo(() => {
    if (!baseLookupsQuery.data) {
      return { groupIds: [], subgroupIds: [], brandIds: [] }
    }
    return collectMissingCatalogIds(items, baseLookupsQuery.data)
  }, [baseLookupsQuery.data, items])

  const supplementalLookupsQuery = useQuery({
    queryKey: [
      ...productsQueryKeys.enterprises(enterpriseId ?? "", {}),
      "list-display-lookups-supplemental",
      missingCatalogIds,
    ],
    queryFn: ({ signal }) =>
      fetchProductsListLookups({
        includeGroups:
          perms.canConsultProductGroups && missingCatalogIds.groupIds.length > 0,
        includeSubgroups:
          perms.canConsultProductSubgroups &&
          missingCatalogIds.subgroupIds.length > 0,
        includeBrands:
          perms.canConsultProductBrands && missingCatalogIds.brandIds.length > 0,
        includeApplications: false,
        includeStock: false,
        supplementalGroupIds: missingCatalogIds.groupIds,
        supplementalSubgroupIds: missingCatalogIds.subgroupIds,
        supplementalBrandIds: missingCatalogIds.brandIds,
        signal,
      }),
    enabled:
      enabled &&
      Boolean(enterpriseId) &&
      baseLookupsQuery.isSuccess &&
      (missingCatalogIds.groupIds.length > 0 ||
        missingCatalogIds.subgroupIds.length > 0 ||
        missingCatalogIds.brandIds.length > 0),
    staleTime,
    gcTime: gcTimeForStaleTime(staleTime),
  })

  return useMemo(() => {
    const lookups = baseLookupsQuery.data
      ? {
          groups: [
            ...(baseLookupsQuery.data.groups ?? []),
            ...(supplementalLookupsQuery.data?.groups ?? []),
          ],
          subgroups: [
            ...(baseLookupsQuery.data.subgroups ?? []),
            ...(supplementalLookupsQuery.data?.subgroups ?? []),
          ],
          brands: [
            ...(baseLookupsQuery.data.brands ?? []),
            ...(supplementalLookupsQuery.data?.brands ?? []),
          ],
          applications: baseLookupsQuery.data.applications,
          locations: baseLookupsQuery.data.locations,
          sectorRentals: baseLookupsQuery.data.sectorRentals,
          batchBalances: baseLookupsQuery.data.batchBalances,
          batches: baseLookupsQuery.data.batches,
        }
      : {}

    return enrichProductEnterpriseListItems(items, lookups)
  }, [baseLookupsQuery.data, items, supplementalLookupsQuery.data])
}
