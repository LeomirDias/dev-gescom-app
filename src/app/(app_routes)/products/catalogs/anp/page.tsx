"use client"

import { CatalogListView } from "@/app/(app_routes)/products/catalogs/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/catalogs/_components/catalog-config"
import type { ProductAnp } from "@/modules/products/products-catalogs.schema"
import { useProductsAnpQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("anp")!

export default function AnpCatalogPage() {
  return (
    <CatalogListView<ProductAnp>
      config={config}
      layout="card"
      cardTitle={(item) => item.anp}
      cardSubtitle={(item) => item.description}
      mobileTitle={(item) => item.description}
      mobileSubtitle={(item) => item.anp}
      useListData={useProductsAnpQuery}
    />
  )
}
