"use client"

import { StockListView } from "@/app/(app_routes)/stock/_components/stock-list-view"
import { getStockResourceConfig } from "@/app/(app_routes)/stock/_components/stock-config"
import type { StockMinMax } from "@/modules/stock/stock.schema"
import { useStockMinMaxQuery } from "@/modules/stock/use-stock"

const config = getStockResourceConfig("min-max")

export default function StockMinMaxPage() {
  return (
    <StockListView<StockMinMax>
      config={config}
      columns={[
        { header: "Produto", cell: (item) => item.productsEnterprisesId },
        { header: "Mínimo", cell: (item) => item.quantityMin },
        { header: "Máximo", cell: (item) => item.quantityMax },
      ]}
      mobileTitle={(item) => `${item.quantityMin} – ${item.quantityMax}`}
      mobileSubtitle={(item) => item.productsEnterprisesId}
      useListData={useStockMinMaxQuery}
    />
  )
}
