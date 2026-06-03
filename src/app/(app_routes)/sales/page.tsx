"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import { BarChart3, RefreshCw } from "lucide-react"

import { SalesFilters } from "@/app/(app_routes)/sales/_components/sales-filters"
import { SalesContentLoading } from "@/app/(app_routes)/sales/_components/sales-route-loading"
import { SalesTable } from "@/app/(app_routes)/sales/_components/sales-table"
import {
  ListErrorCard,
  PaginatedListLayout,
  PermissionDeniedCard,
  PermissionsErrorCard,
  StaleDataBanner,
  useListErrorState,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
import { Button } from "@/components/ui/button"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import {
  SALES_DASHBOARD_PATH,
  defaultSalesFilters,
} from "@/modules/sales/sales-constants"
import type { ListSalesQuery } from "@/modules/sales/sales.schema"
import { useSalesQuery } from "@/modules/sales/use-sales"

export default function SalesPage() {
  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const [draftFilters, setDraftFilters] = useState<ListSalesQuery>(
    defaultSalesFilters()
  )
  const [appliedFilters, setAppliedFilters] =
    useState<ListSalesQuery>(defaultSalesFilters())

  const { data, error, isPending, isFetching, refetch } = useSalesQuery({
    filters: appliedFilters,
    enabled: ready && perms.canConsultSales,
  })

  const applyFilters = useCallback(() => {
    setAppliedFilters({ ...draftFilters, offset: 0 })
  }, [draftFilters])

  const clearFilters = useCallback(() => {
    const reset = defaultSalesFilters()
    setDraftFilters(reset)
    setAppliedFilters(reset)
  }, [])

  const { errMessage, errMeta } = useListErrorState(
    error,
    "Não foi possível carregar as vendas."
  )

  if (!ready || !perms.isReady) {
    return (
      <PaginatedListLayout loading={<SalesContentLoading />}>{null}</PaginatedListLayout>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />

  if (!perms.canConsultSales) {
    return <PermissionDeniedCard permissionLabel="consultar_vendas" />
  }

  return (
    <PaginatedListLayout loading={isPending ? <SalesContentLoading /> : null}>
      {error && data && <StaleDataBanner message={errMessage} />}
      {error && !data && !isPending && (
        <ListErrorCard
          title="Erro ao carregar vendas"
          message={errMessage}
          meta={errMeta}
        />
      )}
      {data && !isPending && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight">
                Vendas e orçamentos
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {data.total} registo(s) · consulta somente leitura
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={SALES_DASHBOARD_PATH}>
                  <BarChart3 className="mr-2 size-4" />
                  Dashboard
                </Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isFetching}
                onClick={() => void refetch()}
              >
                <RefreshCw
                  className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Actualizar
              </Button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              applyFilters()
            }}
          >
            <SalesFilters
              filters={draftFilters}
              onChange={setDraftFilters}
              onApply={applyFilters}
              onClear={clearFilters}
            />
          </form>

          <SalesTable
            items={data.items}
            total={data.total}
            limit={data.limit}
            offset={data.offset}
            onPageChange={(offset) =>
              setAppliedFilters((f) => ({ ...f, offset }))
            }
          />
        </div>
      )}
    </PaginatedListLayout>
  )
}
