"use client"

import { useMemo } from "react"

import { StockListView } from "@/app/(app_routes)/stock/_components/stock-list-view"
import { getStockResourceConfig } from "@/app/(app_routes)/stock/_components/stock-config"
import {
  buildLookupMap,
  formatIdFallback,
  formatQuantity,
} from "@/app/(app_routes)/stock/_components/stock-lookup-utils"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import type { StockMinMax } from "@/modules/stock/stock.schema"
import { useStockMinMaxQuery } from "@/modules/stock/use-stock"
import { useProductsEnterprisesQuery } from "@/modules/products/use-products"

const config = getStockResourceConfig("min-max")

const LOOKUP_FILTERS = { limit: 200, offset: 0 }

export default function StockMinMaxPage() {
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
    <StockListView<StockMinMax>
      config={config}
      columns={[
        {
          header: "Produto",
          cell: (item) =>
            productMap.get(item.productsEnterprisesId) ??
            formatIdFallback(item.productsEnterprisesId),
        },
        {
          header: "Mínimo",
          cell: (item) => formatQuantity(item.quantityMin),
        },
        {
          header: "Máximo",
          cell: (item) => formatQuantity(item.quantityMax),
        },
      ]}
      mobileTitle={(item) =>
        productMap.get(item.productsEnterprisesId) ??
        formatIdFallback(item.productsEnterprisesId)
      }
      mobileSubtitle={(item) =>
        `${formatQuantity(item.quantityMin)} – ${formatQuantity(item.quantityMax)}`
      }
      useListData={useStockMinMaxQuery}
    />
  )
}
