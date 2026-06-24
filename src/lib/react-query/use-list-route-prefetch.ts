"use client"

import { useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"

import { defaultProductsEnterprisesFilters } from "@/app/(app_routes)/products/_components/products-constants"
import { useOperatorPermissions } from "@/lib/permissions"
import { prefetchTenantQuery } from "@/lib/react-query/prefetch"
import { useActiveEnterpriseId } from "@/lib/tenant/use-active-enterprise-id"
import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"
import { membersQueryKey } from "@/modules/memberships/memberships-query-keys"
import { listMembersService } from "@/modules/memberships/memberships.service"
import { productsQueryKeys } from "@/modules/products/products-query-keys"
import { listProductsEnterprisesService } from "@/modules/products/products.service"
import { defaultSalesFilters } from "@/modules/sales/sales-constants"
import { salesQueryKeys } from "@/modules/sales/sales-query-keys"
import { listSalesService } from "@/modules/sales/sales.service"
import { stockQueryKeys } from "@/modules/stock/stock-query-keys"
import { listStockSectorsService } from "@/modules/stock/stock.service"

const DEFAULT_STOCK_FILTERS = { limit: 50, offset: 0 }

const DEFAULT_MEMBERS_LIST_FILTERS: ListMembersQuery = {
  class: undefined,
  userId: undefined,
  offset: 0,
  limit: 50,
}

export function useListRoutePrefetch() {
  const queryClient = useQueryClient()
  const enterpriseId = useActiveEnterpriseId()
  const perms = useOperatorPermissions()

  return useCallback(
    (routeUrl: string) => {
      if (!enterpriseId) return

      switch (routeUrl) {
        case "/sales":
          if (!perms.canConsultSales) return
          prefetchTenantQuery(queryClient, {
            queryKey: salesQueryKeys.list(enterpriseId, defaultSalesFilters()),
            queryFn: () => listSalesService(defaultSalesFilters()),
          })
          break
        case "/members":
        case "/clients":
          if (!perms.canConsultMembers) return
          prefetchTenantQuery(queryClient, {
            queryKey: membersQueryKey(
              enterpriseId,
              DEFAULT_MEMBERS_LIST_FILTERS
            ),
            queryFn: () =>
              listMembersService(enterpriseId, DEFAULT_MEMBERS_LIST_FILTERS),
          })
          break
        case "/products":
          if (!perms.canConsultProducts) return
          prefetchTenantQuery(queryClient, {
            queryKey: productsQueryKeys.enterprises(
              enterpriseId,
              defaultProductsEnterprisesFilters()
            ),
            queryFn: () =>
              listProductsEnterprisesService(defaultProductsEnterprisesFilters()),
          })
          break
        case "/stock/sectors":
          if (!perms.canConsultStockSectors) return
          prefetchTenantQuery(queryClient, {
            queryKey: stockQueryKeys.sectors(enterpriseId, DEFAULT_STOCK_FILTERS),
            queryFn: () => listStockSectorsService(DEFAULT_STOCK_FILTERS),
          })
          break
        default:
          break
      }
    },
    [enterpriseId, perms, queryClient]
  )
}
