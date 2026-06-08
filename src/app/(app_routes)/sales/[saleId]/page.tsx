"use client"

import { use } from "react"

import { SaleBudgetConversionsTable } from "@/app/(app_routes)/sales/_components/sale-budget-conversions-table"
import { SaleDetailView } from "@/app/(app_routes)/sales/_components/sale-detail"
import { SaleReturnsTable } from "@/app/(app_routes)/sales/_components/sale-returns-table"
import { SaleDetailLoading } from "@/app/(app_routes)/sales/_components/sales-route-loading"
import {
  ListErrorCard,
  PaginatedListLayout,
  PermissionDeniedCard,
  PermissionsErrorCard,
  useListErrorState,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import {
  useBudgetConversionsQuery,
  useSaleQuery,
  useSaleReturnsQuery,
} from "@/modules/sales/use-sales"

type SaleDetailPageProps = {
  params: Promise<{ saleId: string }>
}

export default function SaleDetailPage({ params }: SaleDetailPageProps) {
  const { saleId } = use(params)
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const saleQuery = useSaleQuery({
    enterpriseId,
    saleId,
    enabled: ready && perms.canConsultSales,
  })

  const returnsQuery = useSaleReturnsQuery({
    enterpriseId,
    saleId,
    enabled: ready && perms.canConsultSaleReturns && Boolean(saleQuery.data),
  })

  const conversionsQuery = useBudgetConversionsQuery({
    enterpriseId,
    saleId,
    enabled:
      ready &&
      perms.canConsultSales &&
      saleQuery.data?.type === "ORCAMENTO",
  })

  const { errMessage, errMeta } = useListErrorState(
    saleQuery.error,
    "Não foi possível carregar a venda."
  )

  if (!ready || !perms.isReady) {
    return (
      <PaginatedListLayout loading={<SaleDetailLoading />}>{null}</PaginatedListLayout>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />

  if (!perms.canConsultSales) {
    return <PermissionDeniedCard permissionLabel="consultar_vendas" />
  }

  return (
    <PaginatedListLayout
      loading={saleQuery.isPending ? <SaleDetailLoading /> : null}
    >
      {saleQuery.error && !saleQuery.isPending && (
        <ListErrorCard
          title="Erro ao carregar venda"
          message={errMessage}
          meta={errMeta}
        />
      )}

      {saleQuery.data && !saleQuery.isPending && (
        <div className="space-y-6">
          <SaleDetailView
            sale={saleQuery.data}
            onRefresh={() => void saleQuery.refetch()}
            isRefreshing={saleQuery.isFetching}
          />

          {perms.canConsultSaleReturns && returnsQuery.data && (
            <SaleReturnsTable returns={returnsQuery.data} />
          )}

          {saleQuery.data.type === "ORCAMENTO" && conversionsQuery.data && (
            <SaleBudgetConversionsTable conversions={conversionsQuery.data} />
          )}
        </div>
      )}
    </PaginatedListLayout>
  )
}
