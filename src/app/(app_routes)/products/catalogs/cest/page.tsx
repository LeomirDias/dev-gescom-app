"use client"

import { CatalogListView } from "@/app/(app_routes)/products/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import type { ProductCest } from "@/modules/products/products-catalogs.schema"
import { useProductsCestQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("cest")!

export default function CestCatalogPage() {
  return (
    <CatalogListView<ProductCest>
      config={config}
      columns={[
        { header: "CEST", cell: (item) => item.cest },
        { header: "Descrição", cell: (item) => item.description },
      ]}
      mobileTitle={(item) => item.description}
      mobileSubtitle={(item) => item.cest}
      useListData={useProductsCestQuery}
    />
  )
}
