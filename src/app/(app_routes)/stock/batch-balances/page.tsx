"use client"

import { StockListView } from "@/app/(app_routes)/stock/_components/stock-list-view"
import { getStockResourceConfig } from "@/app/(app_routes)/stock/_components/stock-config"
import type { StockBatchBalance } from "@/modules/stock/stock.schema"
import { useStockBatchBalancesQuery } from "@/modules/stock/use-stock"

const config = getStockResourceConfig("batch-balances")

export default function StockBatchBalancesPage() {
  return (
    <StockListView<StockBatchBalance>
      config={config}
      columns={[
        { header: "Lote", cell: (item) => item.stockBatchId },
        { header: "Locação", cell: (item) => item.stockLocationId },
        { header: "Quantidade", cell: (item) => item.quantity },
      ]}
      mobileTitle={(item) => item.quantity}
      mobileSubtitle={(item) => item.stockBatchId}
      useListData={useStockBatchBalancesQuery}
    />
  )
}
