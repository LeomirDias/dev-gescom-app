"use client"

import { useMemo } from "react"

import { StockListView } from "@/app/(app_routes)/stock/_components/stock-list-view"
import { getStockResourceConfig } from "@/app/(app_routes)/stock/_components/stock-config"
import {
  buildLookupMap,
  formatIdFallback,
  formatQuantity,
} from "@/app/(app_routes)/stock/_components/stock-lookup-utils"
import { StockMovementTypeBadge } from "@/app/(app_routes)/stock/_components/stock-status-badge"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import type { StockMovement } from "@/modules/stock/stock.schema"
import { useStockMovementsQuery } from "@/modules/stock/use-stock"
import { useProductsEnterprisesQuery } from "@/modules/products/use-products"

const config = getStockResourceConfig("movements")

const LOOKUP_FILTERS = { limit: 200, offset: 0 }

export default function StockMovementsPage() {
  const { ready } = useRequireEnterprise()

  const { data: productsData } = useProductsEnterprisesQuery({
    filters: LOOKUP_FILTERS,
    enabled: ready,
  })

  const productMap = useMemo(
    () =>
      buildLookupMap(
        productsData?.items,
        (item) => item.id,
        (item) => item.description
      ),
    [productsData]
  )

  return (
    <StockListView<StockMovement>
      config={config}
      columns={[
        {
          header: "Produto",
          cell: (item) =>
            productMap.get(item.productsEnterprisesId) ??
            formatIdFallback(item.productsEnterprisesId),
        },
        {
          header: "Tipo",
          cell: (item) => <StockMovementTypeBadge type={item.type} />,
        },
        {
          header: "Quantidade",
          cell: (item) => formatQuantity(item.quantity),
        },
        {
          header: "Data",
          cell: (item) => new Date(item.createdAt).toLocaleString("pt-BR"),
        },
      ]}
      mobileTitle={(item) =>
        productMap.get(item.productsEnterprisesId) ??
        formatIdFallback(item.productsEnterprisesId)
      }
      mobileSubtitle={(item) => formatQuantity(item.quantity)}
      useListData={useStockMovementsQuery}
    />
  )
}
