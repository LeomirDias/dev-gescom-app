"use client"

import { CatalogListView } from "@/app/(app_routes)/products/catalogs/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/catalogs/_components/catalog-config"
import type { TypeProduct } from "@/modules/products/products-catalogs.schema"
import { useTypesProductsQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("types")!

export default function TypesCatalogPage() {
  return (
    <CatalogListView<TypeProduct>
      config={config}
      layout="card"
      cardTitle={(item) => item.type}
      cardSubtitle={(item) => item.description}
      mobileTitle={(item) => item.description}
      mobileSubtitle={(item) => item.type}
      useListData={useTypesProductsQuery}
    />
  )
}
