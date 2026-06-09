"use client"

import { StockListView } from "@/app/(app_routes)/stock/_components/stock-list-view"
import { getStockResourceConfig } from "@/app/(app_routes)/stock/_components/stock-config"
import type { StockMovement } from "@/modules/stock/stock.schema"
import { useStockMovementsQuery } from "@/modules/stock/use-stock"

const config = getStockResourceConfig("movements")

export default function StockMovementsPage() {
  return (
    <StockListView<StockMovement>
      config={config}
      columns={[
        { header: "Tipo", cell: (item) => item.type },
        { header: "Quantidade", cell: (item) => item.quantity },
        { header: "Data", cell: (item) => new Date(item.createdAt).toLocaleString("pt-BR") },
      ]}
      mobileTitle={(item) => item.type}
      mobileSubtitle={(item) => item.quantity}
      useListData={useStockMovementsQuery}
    />
  )
}
