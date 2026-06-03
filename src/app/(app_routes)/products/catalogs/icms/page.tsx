"use client"

import { CatalogListView } from "@/app/(app_routes)/products/_components/catalog-list-view"
import { getCatalogConfig } from "@/app/(app_routes)/products/_components/catalog-config"
import type { IcmsTaxation } from "@/modules/products/products-catalogs.schema"
import { useIcmsTaxationQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("icms")!

export default function IcmsCatalogPage() {
  return (
    <CatalogListView<IcmsTaxation>
      config={config}
      columns={[
        { header: "ICMS", cell: (item) => item.icms },
        { header: "Descrição", cell: (item) => item.description },
      ]}
      mobileTitle={(item) => item.description}
      useListData={useIcmsTaxationQuery}
    />
  )
}
