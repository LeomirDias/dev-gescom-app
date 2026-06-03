"use client"

import { TenantResourceListView } from "@/app/(app_routes)/products/_components/tenant-resource-list-view"
import { useOperatorPermissions } from "@/lib/permissions"
import type { ProductTaxation } from "@/modules/products/products-tenant-extras.schema"
import { useProductTaxationListQuery } from "@/modules/products/use-products"

export default function ProductTaxationPage() {
  const perms = useOperatorPermissions()
  return (
    <TenantResourceListView<ProductTaxation>
      title="Tributação de produtos"
      description="Tributação PIS/COFINS e ICMS por produto"
      permissionLabel="consultar_tributacao_produto"
      canConsult={perms.canConsultProductTaxation}
      basePath="/products/taxation"
      columns={[
        {
          header: "PIS entrada",
          cell: (item) => item.cst_pis_entrada ?? "—",
        },
        {
          header: "PIS saída",
          cell: (item) => item.cst_pis_saida ?? "—",
        },
      ]}
      mobileTitle={() => "Tributação"}
      useListData={useProductTaxationListQuery}
    />
  )
}
