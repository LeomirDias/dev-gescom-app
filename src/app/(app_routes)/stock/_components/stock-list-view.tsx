"use client"

import { useCallback, useState } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import {
  DEFAULT_STOCK_FILTERS,
  type StockResourceConfig,
} from "@/app/(app_routes)/stock/_components/stock-config"
import {
  PaginatedListLayout,
  ListErrorCard,
  PermissionDeniedCard,
  PermissionsErrorCard,
  StaleDataBanner,
  useListErrorState,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
import {
  PaginatedResourceTable,
  type ResourceColumn,
} from "@/app/(app_routes)/products/_components/paginated-resource-table"
import { ProductsContentLoading } from "@/app/(app_routes)/products/_components/products-route-loading"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import type { PaginationQuery } from "@/modules/stock/stock.schema"

type ListHookResult<T> = {
  data:
    | { items: T[]; total: number; limit: number; offset: number }
    | undefined
  error: unknown
  isPending: boolean
  isFetching: boolean
  refetch: () => void
}

type StockListViewProps<T extends { id: string }> = {
  config: StockResourceConfig
  columns: ResourceColumn<T>[]
  mobileTitle: (item: T) => string
  mobileSubtitle?: (item: T) => string
  useListData: (opts: {
    filters: PaginationQuery
    enabled: boolean
  }) => ListHookResult<T>
}

export function StockListView<T extends { id: string }>({
  config,
  columns,
  mobileTitle,
  mobileSubtitle,
  useListData,
}: StockListViewProps<T>) {
  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const canConsult = perms[config.permissionKey]

  const [appliedFilters, setAppliedFilters] =
    useState<PaginationQuery>(DEFAULT_STOCK_FILTERS)

  const { data, error, isPending, isFetching, refetch } = useListData({
    filters: appliedFilters,
    enabled: ready && perms.isReady && canConsult,
  })

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled: ready && perms.isReady && !perms.isError && canConsult,
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    `Não foi possível carregar ${config.title.toLowerCase()}.`
  )

  if (!ready || !perms.isReady) {
    return (
      <PaginatedListLayout loading={<ProductsContentLoading />}>{null}</PaginatedListLayout>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />
  if (!canConsult) {
    return <PermissionDeniedCard permissionLabel={config.permissionLabel} />
  }

  return (
    <PaginatedListLayout loading={isPending ? <ProductsContentLoading /> : null}>
      {Boolean(error) && data && <StaleDataBanner message={errMessage} />}
      {Boolean(error) && !data && !isPending && (
        <ListErrorCard
          title={`Erro ao carregar ${config.title.toLowerCase()}`}
          message={errMessage}
          meta={errMeta}
        />
      )}
      {data && !isPending && (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <RouteBreadcrumb />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {config.title}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {config.description} · {data.total} registo(s)
              </p>
            </div>
          </div>

          <PaginatedResourceTable
            items={data.items}
            total={data.total}
            limit={data.limit}
            offset={data.offset}
            onPageChange={(offset) =>
              setAppliedFilters((f) => ({ ...f, offset }))
            }
            basePath={config.basePath}
            emptyTitle="Nenhum registo encontrado"
            emptyDescription="Não há itens de estoque para exibir."
            columns={columns}
            mobileTitle={mobileTitle}
            mobileSubtitle={mobileSubtitle}
          />
        </div>
      )}
    </PaginatedListLayout>
  )
}
