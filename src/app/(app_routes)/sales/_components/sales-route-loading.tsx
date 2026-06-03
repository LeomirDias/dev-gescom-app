import { Skeleton } from "@/components/ui/skeleton"

export function SalesContentLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar vendas"
      className="space-y-6"
    >
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}

export function SalesDashboardLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar dashboard de vendas"
      className="space-y-6"
    >
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-lg" />
        <Skeleton className="h-80 rounded-lg" />
      </div>
    </div>
  )
}

export function SaleDetailLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar detalhe da venda"
      className="space-y-6"
    >
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-56 w-full rounded-lg" />
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  )
}
