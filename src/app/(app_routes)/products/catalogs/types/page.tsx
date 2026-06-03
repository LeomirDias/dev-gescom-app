"use client"

import { CatalogListView } from "@/app/(app_routes)/products/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import type { TypeProduct } from "@/modules/products/products-catalogs.schema"
import { useTypesProductsQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("types")!

export default function TypesCatalogPage() {
  return (
    <CatalogListView<TypeProduct>
      config={config}
      columns={[
        { header: "Tipo", cell: (item) => item.type },
        { header: "Descrição", cell: (item) => item.description },
      ]}
      mobileTitle={(item) => item.description}
      useListData={useTypesProductsQuery}
    />
  )
}
