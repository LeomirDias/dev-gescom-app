"use client"

import { CatalogListView } from "@/app/(app_routes)/products/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import type { ProductBrand } from "@/modules/products/products-catalogs.schema"
import { useProductBrandsQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("brands")!

export default function BrandsCatalogPage() {
  return (
    <CatalogListView<ProductBrand>
      config={config}
      columns={[{ header: "Descrição", cell: (item) => item.description }]}
      mobileTitle={(item) => item.description}
      useListData={useProductBrandsQuery}
    />
  )
}
