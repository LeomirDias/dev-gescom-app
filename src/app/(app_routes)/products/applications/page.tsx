"use client"

import { TenantResourceListView } from "@/app/(app_routes)/products/_components/tenant-resource-list-view"
import { useOperatorPermissions } from "@/lib/permissions"
import type { ProductApplication } from "@/modules/products/products-tenant-extras.schema"
import { useProductApplicationsQuery } from "@/modules/products/use-products"

export default function ProductApplicationsPage() {
  const perms = useOperatorPermissions()
  return (
    <TenantResourceListView<ProductApplication>
      title="Aplicações de produto"
      description="Aplicações vinculadas aos produtos da empresa"
      permissionLabel="consultar_aplicacoes_produto"
      canConsult={perms.canConsultProductApplications}
      basePath="/products/applications"
      columns={[{ header: "Descrição", cell: (item) => item.description }]}
      mobileTitle={(item) => item.description}
      useListData={useProductApplicationsQuery}
    />
  )
}
