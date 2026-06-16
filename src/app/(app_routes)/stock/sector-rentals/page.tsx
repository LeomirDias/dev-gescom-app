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
import type { StockSectorRental } from "@/modules/stock/stock.schema"
import {
  useStockLocationsQuery,
  useStockSectorRentalsQuery,
} from "@/modules/stock/use-stock"
import { useProductsEnterprisesQuery } from "@/modules/products/use-products"

const config = getStockResourceConfig("sector-rentals")

const LOOKUP_FILTERS = { limit: 200, offset: 0 }

export default function StockSectorRentalsPage() {
  const { ready } = useRequireEnterprise()

  const { data: productsData } = useProductsEnterprisesQuery({
    filters: LOOKUP_FILTERS,
    enabled: ready,
  })
  const { data: locationsData } = useStockLocationsQuery({
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

  const locationMap = useMemo(
    () =>
      buildLookupMap(
        locationsData?.items,
        (item) => item.id,
        (item) => item.description ?? item.code
      ),
    [locationsData]
  )

  return (
    <StockListView<StockSectorRental>
      config={config}
      columns={[
        {
          header: "Produto",
          cell: (item) =>
            productMap.get(item.productsEnterprisesId) ??
            formatIdFallback(item.productsEnterprisesId),
        },
        {
          header: "Locação",
          cell: (item) =>
            locationMap.get(item.stockLocationId) ??
            formatIdFallback(item.stockLocationId),
        },
        {
          header: "Quantidade",
          cell: (item) => formatQuantity(item.quantity),
        },
      ]}
      mobileTitle={(item) =>
        productMap.get(item.productsEnterprisesId) ??
        formatIdFallback(item.productsEnterprisesId)
      }
      mobileSubtitle={(item) =>
        locationMap.get(item.stockLocationId) ??
        formatIdFallback(item.stockLocationId)
      }
      useListData={useStockSectorRentalsQuery}
    />
  )
}
