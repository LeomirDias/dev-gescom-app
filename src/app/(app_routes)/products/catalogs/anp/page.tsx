"use client"

import { CatalogListView } from "@/app/(app_routes)/products/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import type { ProductAnp } from "@/modules/products/products-catalogs.schema"
import { useProductsAnpQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("anp")!

export default function AnpCatalogPage() {
  return (
    <CatalogListView<ProductAnp>
      config={config}
      columns={[
        { header: "ANP", cell: (item) => item.anp },
        { header: "Descrição", cell: (item) => item.description },
      ]}
      mobileTitle={(item) => item.description}
      useListData={useProductsAnpQuery}
    />
  )
}
