"use client"

import { StockListView } from "@/app/(app_routes)/stock/_components/stock-list-view"
import { getStockResourceConfig } from "@/app/(app_routes)/stock/_components/stock-config"
import type { StockSector } from "@/modules/stock/stock.schema"
import { useStockSectorsQuery } from "@/modules/stock/use-stock"

const config = getStockResourceConfig("sectors")

export default function StockSectorsPage() {
  return (
    <StockListView<StockSector>
      config={config}
      columns={[{ header: "Descrição", cell: (item) => item.description }]}
      mobileTitle={(item) => item.description}
      useListData={useStockSectorsQuery}
    />
  )
}
