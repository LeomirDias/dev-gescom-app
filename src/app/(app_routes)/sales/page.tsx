"use client"

import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
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
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import { filterSalesItemsByDate } from "@/modules/sales/sales-client-filters"
import {
  defaultSalesDateFilters,
  defaultSalesFilters,
  hasActiveSalesDateFilters,
  type SalesDateFilters,
} from "@/modules/sales/sales-constants"
import type { ListSalesQuery } from "@/modules/sales/sales.schema"
import { useSalesQuery } from "@/modules/sales/use-sales"

function parseFiltersFromForm(form: HTMLFormElement): {
  filters: Pick<ListSalesQuery, "orderNumber" | "seller" | "client">
  dateFilters: SalesDateFilters
} {
  const orderNumberEl = form.elements.namedItem(
    "orderNumber"
  ) as HTMLInputElement | null
  const sellerEl = form.elements.namedItem("seller") as HTMLInputElement | null
  const clientEl = form.elements.namedItem("client") as HTMLInputElement | null
  const dateFromEl = form.elements.namedItem(
    "dateFrom"
  ) as HTMLInputElement | null
  const dateToEl = form.elements.namedItem("dateTo") as HTMLInputElement | null

  return {
    filters: {
      orderNumber: orderNumberEl?.value.trim() || undefined,
      seller: sellerEl?.value.trim() || undefined,
      client: clientEl?.value.trim() || undefined,
    },
    dateFilters: {
      dateFrom: dateFromEl?.value.trim() || undefined,
      dateTo: dateToEl?.value.trim() || undefined,
    },
  }
}

export default function SalesPage() {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const [draftFilters, setDraftFilters] = useState<ListSalesQuery>(
    defaultSalesFilters()
  )
  const [appliedFilters, setAppliedFilters] =
    useState<ListSalesQuery>(defaultSalesFilters())
  const [draftDateFilters, setDraftDateFilters] = useState(
    defaultSalesDateFilters()
  )
  const [appliedDateFilters, setAppliedDateFilters] = useState(
    defaultSalesDateFilters()
  )
  const [formKey, setFormKey] = useState(0)

  const { data, error, isPending, isFetching, refetch } = useSalesQuery({
    enterpriseId,
    filters: appliedFilters,
    enabled: ready && perms.canConsultSales,
  })

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled: ready && perms.isReady && !perms.isError && perms.canConsultSales,
  })

  const applyFiltersFromForm = useCallback(() => {
    const form = document.getElementById("sales-filters-form")
    if (!form || !(form instanceof HTMLFormElement)) {
      setAppliedFilters({ ...draftFilters, offset: 0 })
      setAppliedDateFilters(draftDateFilters)
      return
    }

    const { filters: textFilters, dateFilters } = parseFiltersFromForm(form)

    if (
      dateFilters.dateFrom &&
      dateFilters.dateTo &&
      dateFilters.dateFrom > dateFilters.dateTo
    ) {
      toast.error("A data inicial não pode ser posterior à data final.")
      return
    }

    const nextFilters: ListSalesQuery = {
      ...draftFilters,
      offset: 0,
      orderNumber: textFilters.orderNumber,
      seller: textFilters.seller,
      client: textFilters.client,
    }

    setDraftFilters(nextFilters)
    setDraftDateFilters(dateFilters)
    setAppliedFilters(nextFilters)
    setAppliedDateFilters(dateFilters)
  }, [draftFilters, draftDateFilters])

  const clearFilters = useCallback(() => {
    const reset = defaultSalesFilters()
    const resetDate = defaultSalesDateFilters()
    setDraftFilters(reset)
    setAppliedFilters(reset)
    setDraftDateFilters(resetDate)
    setAppliedDateFilters(resetDate)
    setFormKey((key) => key + 1)
  }, [])

  const visibleItems = useMemo(
    () =>
      data ? filterSalesItemsByDate(data.items, appliedDateFilters) : [],
    [data, appliedDateFilters]
  )

  const localDateFilterActive = hasActiveSalesDateFilters(appliedDateFilters)

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
          <form
            key={formKey}
            id="sales-filters-form"
            onSubmit={(e) => {
              e.preventDefault()
              applyFiltersFromForm()
            }}
          >
            <SalesFilters
              filters={draftFilters}
              dateFilters={draftDateFilters}
              onChange={setDraftFilters}
              onApply={applyFiltersFromForm}
              onClear={clearFilters}
            />
          </form>

          <SalesTable
            items={visibleItems}
            total={data.total}
            limit={data.limit}
            offset={data.offset}
            localFilterActive={localDateFilterActive}
            onPageChange={(offset) =>
              setAppliedFilters((f) => ({ ...f, offset }))
            }
          />
        </div>
      )}
    </PaginatedListLayout>
  )
}
