"use client"

import { TenantResourceListView } from "@/app/(app_routes)/products/_components/tenant-resource-list-view"
import { useOperatorPermissions } from "@/lib/permissions"
import type { Price } from "@/modules/products/products-tenant-extras.schema"
import { usePricesQuery } from "@/modules/products/use-products"

export default function PricesPage() {
  const perms = useOperatorPermissions()
  return (
    <TenantResourceListView<Price>
      title="Preços"
      description="Preços dos produtos da empresa"
      permissionLabel="consultar_precos"
      canConsult={perms.canConsultPrices}
      basePath="/products/prices"
      columns={[
        { header: "Preço", cell: (item) => item.price },
        {
          header: "Produto-empresa",
          cell: (item) => (
            <span className="font-mono text-xs">{item.productsEnterprisesId}</span>
          ),
        },
      ]}
      mobileTitle={(item) => `Preço ${item.price}`}
      mobileSubtitle={(item) => item.productsEnterprisesId}
      useListData={usePricesQuery}
    />
  )
}
