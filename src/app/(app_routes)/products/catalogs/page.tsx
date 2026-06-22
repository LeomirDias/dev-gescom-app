"use client"

import Link from "next/link"

import { CATALOG_CONFIGS } from "@/app/(app_routes)/products/catalogs/_components/catalog-config"
import {
  PermissionDeniedCard,
  PermissionsErrorCard,
  PaginatedListLayout,
} from "@/components/global/listing/paginated-list-shell"
import { PageHeader } from "@/components/global/structural/page-header"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useOperatorPermissions } from "@/lib/permissions"

export default function CatalogsHubPage() {
  const perms = useOperatorPermissions()

  if (!perms.isReady) {
    return <PaginatedListLayout isReady={false}>{null}</PaginatedListLayout>
  }

  if (perms.isError) return <PermissionsErrorCard />

  const visibleCatalogs = CATALOG_CONFIGS.filter((c) => perms[c.permissionKey])

  if (visibleCatalogs.length === 0) {
    return (
      <PermissionDeniedCard permissionLabel="qualquer permissão de catálogo de produtos" />
    )
  }

  return (
    <PaginatedListLayout>
      <PageHeader
        title="Catálogos"
        subtitle="Consulte os catálogos fiscais e de referência de produtos"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleCatalogs.map((catalog) => (
          <Link key={catalog.slug} href={catalog.basePath}>
            <Card className="h-full transition-colors hover:bg-muted/30">
              <CardHeader>
                <CardTitle className="text-base">{catalog.title}</CardTitle>
                <CardDescription>{catalog.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </PaginatedListLayout>
  )
}
