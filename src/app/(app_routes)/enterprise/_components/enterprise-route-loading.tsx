import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function EnterpriseContentLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar dados da empresa"
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <div className="flex justify-end">
            <Skeleton className="size-9 shrink-0 rounded-md" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Skeleton className="size-24 shrink-0 rounded-full" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-18 rounded-lg sm:col-span-2" />
            <Skeleton className="h-18 rounded-lg sm:col-span-2" />
            <Skeleton className="h-18 rounded-lg" />
            <Skeleton className="h-18 rounded-lg" />
            <Skeleton className="h-18 rounded-lg" />
            <Skeleton className="h-18 rounded-lg" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border/60 p-4 space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-56" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-28 rounded-md" />
                <Skeleton className="h-7 w-36 rounded-md" />
                <Skeleton className="h-7 w-32 rounded-md" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function EnterpriseRouteLoading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar empresa"
      className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8"
    >
      <EnterpriseContentLoading />
    </main>
  )
}
