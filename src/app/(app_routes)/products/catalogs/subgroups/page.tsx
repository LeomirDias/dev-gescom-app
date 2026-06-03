"use client"

import { CatalogListView } from "@/app/(app_routes)/products/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import type { ProductSubgroup } from "@/modules/products/products-catalogs.schema"
import { useProductSubgroupsQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("subgroups")!

export default function SubgroupsCatalogPage() {
  return (
    <CatalogListView<ProductSubgroup>
      config={config}
      columns={[{ header: "Descrição", cell: (item) => item.description }]}
      mobileTitle={(item) => item.description}
      useListData={useProductSubgroupsQuery}
    />
  )
}
