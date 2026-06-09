"use client"

import { StockListView } from "@/app/(app_routes)/stock/_components/stock-list-view"
import { getStockResourceConfig } from "@/app/(app_routes)/stock/_components/stock-config"
import type { StockBatch } from "@/modules/stock/stock.schema"
import { useStockBatchesQuery } from "@/modules/stock/use-stock"

const config = getStockResourceConfig("batches")

export default function StockBatchesPage() {
  return (
    <StockListView<StockBatch>
      config={config}
      columns={[
        { header: "Lote", cell: (item) => item.batchNumber },
        { header: "Validade", cell: (item) => item.expiryDate ?? "—" },
        { header: "Status", cell: (item) => item.status },
      ]}
      mobileTitle={(item) => item.batchNumber}
      mobileSubtitle={(item) => item.status}
      useListData={useStockBatchesQuery}
    />
  )
}
