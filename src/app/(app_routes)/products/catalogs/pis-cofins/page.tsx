"use client"

import { CatalogListView } from "@/app/(app_routes)/products/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import type { PisCofinsSituation } from "@/modules/products/products-catalogs.schema"
import { usePisCofinsSituationQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("pis-cofins")!

export default function PisCofinsCatalogPage() {
  return (
    <CatalogListView<PisCofinsSituation>
      config={config}
      columns={[
        { header: "CST", cell: (item) => item.cst },
        { header: "Descrição", cell: (item) => item.description },
        { header: "Tipo", cell: (item) => item.type },
      ]}
      mobileTitle={(item) => item.description}
      mobileSubtitle={(item) => item.cst}
      useListData={usePisCofinsSituationQuery}
    />
  )
}
