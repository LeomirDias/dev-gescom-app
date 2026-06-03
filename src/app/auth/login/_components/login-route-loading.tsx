import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoginRouteLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="A carregar login"
      className="flex min-h-svh w-full items-center justify-center p-6 md:p-10"
    >
      <div className="w-full max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="space-y-6 p-6 md:p-8">
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="hidden min-h-88 md:block" />
          </CardContent>
        </Card>
        <Skeleton className="mx-auto mt-6 h-4 w-full max-w-md" />
      </div>
    </div>
  )
}
