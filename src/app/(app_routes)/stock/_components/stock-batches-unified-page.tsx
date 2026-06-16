"use client"

import { useMemo } from "react"

import { StockListView } from "@/app/(app_routes)/stock/_components/stock-list-view"
import { getStockResourceConfig } from "@/app/(app_routes)/stock/_components/stock-config"
import {
  buildLookupMap,
  buildObjectMap,
  formatIdFallback,
  formatQuantity,
} from "@/app/(app_routes)/stock/_components/stock-lookup-utils"
import { StockBatchStatusBadge } from "@/app/(app_routes)/stock/_components/stock-status-badge"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import type { StockBatchBalance } from "@/modules/stock/stock.schema"
import {
  useStockBatchBalancesQuery,
  useStockBatchesQuery,
  useStockLocationsQuery,
} from "@/modules/stock/use-stock"
import { useProductsEnterprisesQuery } from "@/modules/products/use-products"

const config = getStockResourceConfig("batch-balances")

const LOOKUP_FILTERS = { limit: 200, offset: 0 }

function formatDate(value: string | null): string {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("pt-BR")
}

export function StockBatchesUnifiedPage() {
  const { ready } = useRequireEnterprise()

  const { data: batchesData } = useStockBatchesQuery({
    filters: LOOKUP_FILTERS,
    enabled: ready,
  })
  const { data: locationsData } = useStockLocationsQuery({
    filters: LOOKUP_FILTERS,
    enabled: ready,
  })
  const { data: productsData } = useProductsEnterprisesQuery({
    filters: LOOKUP_FILTERS,
    enabled: ready,
  })

  const batchMap = useMemo(
    () => buildObjectMap(batchesData?.items, (item) => item.id),
    [batchesData]
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
    <StockListView<StockBatchBalance>
      config={config}
      columns={[
        {
          header: "Produto",
          cell: (item) => {
            const batch = batchMap.get(item.stockBatchId)
            if (!batch) return formatIdFallback(item.stockBatchId)
            return (
              productMap.get(batch.productsEnterprisesId) ??
              formatIdFallback(batch.productsEnterprisesId)
            )
          },
        },
        {
          header: "Lote",
          cell: (item) =>
            batchMap.get(item.stockBatchId)?.batchNumber ??
            formatIdFallback(item.stockBatchId),
        },
        {
          header: "Validade",
          cell: (item) =>
            formatDate(batchMap.get(item.stockBatchId)?.expiryDate ?? null),
        },
        {
          header: "Status do lote",
          cell: (item) => {
            const status = batchMap.get(item.stockBatchId)?.status
            return status ? (
              <StockBatchStatusBadge status={status} />
            ) : (
              "—"
            )
          },
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
      mobileTitle={(item) => {
        const batch = batchMap.get(item.stockBatchId)
        if (!batch) return formatIdFallback(item.stockBatchId)
        return (
          productMap.get(batch.productsEnterprisesId) ??
          batch.batchNumber
        )
      }}
      mobileSubtitle={(item) =>
        batchMap.get(item.stockBatchId)?.batchNumber ??
        formatIdFallback(item.stockBatchId)
      }
      useListData={useStockBatchBalancesQuery}
    />
  )
}
