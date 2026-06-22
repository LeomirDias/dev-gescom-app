"use client"

import { CatalogListView } from "@/app/(app_routes)/products/catalogs/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/catalogs/_components/catalog-config"
import type { Unit } from "@/modules/products/products-catalogs.schema"
import { useUnitsQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("units")!

export default function UnitsCatalogPage() {
  return (
    <CatalogListView<Unit>
      config={config}
      layout="card"
      cardTitle={(item) => item.unit}
      cardSubtitle={(item) => item.description}
      mobileTitle={(item) => item.description}
      mobileSubtitle={(item) => item.unit}
      useListData={useUnitsQuery}
    />
  )
}
