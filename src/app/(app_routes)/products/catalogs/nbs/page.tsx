"use client"

import { CatalogListView } from "@/app/(app_routes)/products/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import type { ProductNbs } from "@/modules/products/products-catalogs.schema"
import { useProductsNbsQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("nbs")!

export default function NbsCatalogPage() {
  return (
    <CatalogListView<ProductNbs>
      config={config}
      columns={[
        { header: "NBS", cell: (item) => item.nbs },
        { header: "Descrição", cell: (item) => item.description },
      ]}
      mobileTitle={(item) => item.description}
      mobileSubtitle={(item) => item.nbs}
      useListData={useProductsNbsQuery}
    />
  )
}
