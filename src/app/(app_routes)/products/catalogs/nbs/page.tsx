"use client"

import { CatalogListView } from "@/app/(app_routes)/products/catalogs/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/catalogs/_components/catalog-config"
import type { ProductNbs } from "@/modules/products/products-catalogs.schema"
import { useProductsNbsQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("nbs")!

export default function NbsCatalogPage() {
  return (
    <CatalogListView<ProductNbs>
      config={config}
      layout="card"
      cardTitle={(item) => item.nbs}
      cardSubtitle={(item) => item.description}
      mobileTitle={(item) => item.description}
      mobileSubtitle={(item) => item.nbs}
      useListData={useProductsNbsQuery}
    />
  )
}
