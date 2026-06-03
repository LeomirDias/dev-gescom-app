"use client"

import { TenantResourceListView } from "@/app/(app_routes)/products/_components/tenant-resource-list-view"
import { useOperatorPermissions } from "@/lib/permissions"
import type { PromotionalPrice } from "@/modules/products/products-tenant-extras.schema"
import { usePromotionalPricesQuery } from "@/modules/products/use-products"

export default function PromotionalPricesPage() {
  const perms = useOperatorPermissions()
  return (
    <TenantResourceListView<PromotionalPrice>
      title="Preços promocionais"
      description="Promoções dos produtos da empresa"
      permissionLabel="consultar_precos_promocionais"
      canConsult={perms.canConsultPromotionalPrices}
      basePath="/products/promotional-prices"
      columns={[
        { header: "Preço", cell: (item) => item.price },
        { header: "Descrição", cell: (item) => item.description ?? "—" },
      ]}
      mobileTitle={(item) => item.description ?? `Promoção ${item.price}`}
      useListData={usePromotionalPricesQuery}
    />
  )
}
