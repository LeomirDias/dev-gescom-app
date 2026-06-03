"use client"

import { CatalogListView } from "@/app/(app_routes)/products/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import type { ProductGroup } from "@/modules/products/products-catalogs.schema"
import { useProductGroupsQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("groups")!

export default function GroupsCatalogPage() {
  return (
    <CatalogListView<ProductGroup>
      config={config}
      columns={[
        { header: "Descrição", cell: (item) => item.description },
        { header: "Margem", cell: (item) => item.profitMargin ?? "—" },
      ]}
      mobileTitle={(item) => item.description}
      useListData={useProductGroupsQuery}
    />
  )
}
