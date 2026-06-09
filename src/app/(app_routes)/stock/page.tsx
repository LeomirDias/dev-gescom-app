import Link from "next/link"

import { STOCK_RESOURCE_CONFIGS } from "@/app/(app_routes)/stock/_components/stock-config"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"

export default function StockIndexPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <RouteBreadcrumb />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Estoque</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Setores, locações, lotes, saldos e movimentos
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STOCK_RESOURCE_CONFIGS.map((resource) => (
          <Link
            key={resource.slug}
            href={resource.basePath}
            className="rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent/40"
          >
            <h2 className="font-medium">{resource.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {resource.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
