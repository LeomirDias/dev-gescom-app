import { Skeleton } from "@/components/ui/skeleton"

export function ProductsContentLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="A carregar produtos">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-28" />
      </div>
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}

export function ProductDetailContentLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="A carregar produto">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  )
}

export function ProductsRouteLoading() {
  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <ProductsContentLoading />
    </main>
  )
}
