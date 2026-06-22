"use client"

import { CatalogListView } from "@/app/(app_routes)/products/catalogs/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/catalogs/_components/catalog-config"
import type { IcmsTaxation } from "@/modules/products/products-catalogs.schema"
import { useIcmsTaxationQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("icms")!

export default function IcmsCatalogPage() {
  return (
    <CatalogListView<IcmsTaxation>
      config={config}
      layout="card"
      cardTitle={(item) => item.icms}
      cardSubtitle={(item) => item.description}
      mobileTitle={(item) => item.description}
      mobileSubtitle={(item) => item.icms}
      useListData={useIcmsTaxationQuery}
    />
  )
}
