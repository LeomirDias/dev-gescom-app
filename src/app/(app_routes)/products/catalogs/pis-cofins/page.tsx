"use client"

import { CatalogListView } from "@/app/(app_routes)/products/catalogs/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/catalogs/_components/catalog-config"
import type { PisCofinsSituation } from "@/modules/products/products-catalogs.schema"
import { usePisCofinsSituationQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("pis-cofins")!

export default function PisCofinsCatalogPage() {
  return (
    <CatalogListView<PisCofinsSituation>
      config={config}
      layout="card"
      cardTitle={(item) => item.cst}
      cardSubtitle={(item) => item.description}
      mobileTitle={(item) => item.description}
      mobileSubtitle={(item) => item.cst}
      useListData={usePisCofinsSituationQuery}
    />
  )
}
