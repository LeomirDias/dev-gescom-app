"use client"

import { StockListView } from "@/app/(app_routes)/stock/_components/stock-list-view"
import { getStockResourceConfig } from "@/app/(app_routes)/stock/_components/stock-config"
import { StockLocationStatusBadge } from "@/app/(app_routes)/stock/_components/stock-status-badge"
import type { StockLocation } from "@/modules/stock/stock.schema"
import { useStockLocationsQuery } from "@/modules/stock/use-stock"

const config = getStockResourceConfig("locations")

export default function StockLocationsPage() {
  return (
    <StockListView<StockLocation>
      config={config}
      columns={[
        { header: "Código", cell: (item) => item.code },
        { header: "Descrição", cell: (item) => item.description ?? "—" },
        {
          header: "Status",
          cell: (item) => <StockLocationStatusBadge status={item.status} />,
        },
      ]}
      mobileTitle={(item) => item.code}
      mobileSubtitle={(item) => item.description ?? "—"}
      useListData={useStockLocationsQuery}
    />
  )
}
