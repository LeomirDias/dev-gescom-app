"use client"

import { StockListView } from "@/app/(app_routes)/stock/_components/stock-list-view"
import { getStockResourceConfig } from "@/app/(app_routes)/stock/_components/stock-config"
import type { StockSectorRental } from "@/modules/stock/stock.schema"
import { useStockSectorRentalsQuery } from "@/modules/stock/use-stock"

const config = getStockResourceConfig("sector-rentals")

export default function StockSectorRentalsPage() {
  return (
    <StockListView<StockSectorRental>
      config={config}
      columns={[
        { header: "Produto", cell: (item) => item.productsEnterprisesId },
        { header: "Locação", cell: (item) => item.stockLocationId },
        { header: "Quantidade", cell: (item) => item.quantity },
      ]}
      mobileTitle={(item) => item.quantity}
      mobileSubtitle={(item) => item.productsEnterprisesId}
      useListData={useStockSectorRentalsQuery}
    />
  )
}
