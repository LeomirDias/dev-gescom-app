"use client"

import { CatalogListView } from "@/app/(app_routes)/products/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import type { ProductNcm } from "@/modules/products/products-catalogs.schema"
import { useProductsNcmQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("ncm")!

export default function NcmCatalogPage() {
  return (
    <CatalogListView<ProductNcm>
      config={config}
      columns={[
        { header: "NCM", cell: (item) => item.ncm },
        { header: "Descrição", cell: (item) => item.description },
      ]}
      mobileTitle={(item) => item.description}
      mobileSubtitle={(item) => item.ncm}
      useListData={useProductsNcmQuery}
    />
  )
}
