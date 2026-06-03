"use client"

import { useQuery } from "@tanstack/react-query"

import type { AnalyticsQuery } from "@/modules/sales/sales-analytics.schema"
import {
  getOperationsCancellationsService,
  getOperationsStatusBreakdownService,
  getPipelineBudgetsFunnelService,
  getPipelineOverviewService,
  getRealizedByPaymentTypeService,
  getRealizedBySellerService,
  getRealizedOverviewService,
  getRealizedReturnsService,
  getRealizedTimeseriesService,
  getRealizedTopProductsService,
  getReceivablesAgingService,
  getReceivablesSummaryService,
} from "@/modules/sales/sales-analytics.service"
import type { DashboardFilters } from "@/modules/sales/sales-constants"

const ANALYTICS_STALE_TIME = 60_000

export const salesAnalyticsQueryKeys = {
  all: ["sales-analytics"] as const,
  realizedOverview: (filters: AnalyticsQuery) =>
    ["sales-analytics", "realized-overview", filters] as const,
  realizedTimeseries: (filters: AnalyticsQuery) =>
    ["sales-analytics", "realized-timeseries", filters] as const,
  byPaymentType: (filters: AnalyticsQuery) =>
    ["sales-analytics", "by-payment-type", filters] as const,
  bySeller: (filters: AnalyticsQuery) =>
    ["sales-analytics", "by-seller", filters] as const,
  topProducts: (filters: AnalyticsQuery) =>
    ["sales-analytics", "top-products", filters] as const,
  returns: (filters: AnalyticsQuery) =>
    ["sales-analytics", "returns", filters] as const,
  pipelineOverview: (filters: AnalyticsQuery) =>
    ["sales-analytics", "pipeline-overview", filters] as const,
  budgetFunnel: (filters: AnalyticsQuery) =>
    ["sales-analytics", "budget-funnel", filters] as const,
  statusBreakdown: (filters: AnalyticsQuery) =>
    ["sales-analytics", "status-breakdown", filters] as const,
  cancellations: (filters: AnalyticsQuery) =>
    ["sales-analytics", "cancellations", filters] as const,
  receivablesSummary: (filters: AnalyticsQuery) =>
    ["sales-analytics", "receivables-summary", filters] as const,
  receivablesAging: (filters: AnalyticsQuery) =>
    ["sales-analytics", "receivables-aging", filters] as const,
}

export function dashboardFiltersToAnalyticsQuery(
  filters: DashboardFilters,
  extra?: Partial<AnalyticsQuery>
): AnalyticsQuery {
  const base: AnalyticsQuery = {
    timezone: filters.timezone,
    compareMode: filters.compareMode,
    userId: filters.userId,
  }

  if (filters.dateFrom && filters.dateTo) {
    return { ...base, dateFrom: filters.dateFrom, dateTo: filters.dateTo, ...extra }
  }

  return { ...base, periodPreset: filters.periodPreset, ...extra }
}

export function useRealizedOverviewQuery({
  filters,
  enabled = true,
}: {
  filters: AnalyticsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.realizedOverview(filters),
    queryFn: () => getRealizedOverviewService(filters),
    enabled,
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function useRealizedTimeseriesQuery({
  filters,
  enabled = true,
}: {
  filters: AnalyticsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.realizedTimeseries(filters),
    queryFn: () => getRealizedTimeseriesService(filters),
    enabled,
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function useRealizedByPaymentTypeQuery({
  filters,
  enabled = true,
}: {
  filters: AnalyticsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.byPaymentType(filters),
    queryFn: () => getRealizedByPaymentTypeService(filters),
    enabled,
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function useRealizedBySellerQuery({
  filters,
  enabled = true,
}: {
  filters: AnalyticsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.bySeller(filters),
    queryFn: () => getRealizedBySellerService(filters),
    enabled,
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function useRealizedTopProductsQuery({
  filters,
  enabled = true,
}: {
  filters: AnalyticsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.topProducts(filters),
    queryFn: () => getRealizedTopProductsService(filters),
    enabled,
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function useRealizedReturnsAnalyticsQuery({
  filters,
  enabled = true,
}: {
  filters: AnalyticsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.returns(filters),
    queryFn: () => getRealizedReturnsService(filters),
    enabled,
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function usePipelineOverviewQuery({
  filters,
  enabled = true,
}: {
  filters: AnalyticsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.pipelineOverview(filters),
    queryFn: () => getPipelineOverviewService(filters),
    enabled,
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function useBudgetFunnelQuery({
  filters,
  enabled = true,
}: {
  filters: AnalyticsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.budgetFunnel(filters),
    queryFn: () => getPipelineBudgetsFunnelService(filters),
    enabled,
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function useOperationsStatusBreakdownQuery({
  filters,
  enabled = true,
}: {
  filters: AnalyticsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.statusBreakdown(filters),
    queryFn: () => getOperationsStatusBreakdownService(filters),
    enabled,
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function useOperationsCancellationsQuery({
  filters,
  enabled = true,
}: {
  filters: AnalyticsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.cancellations(filters),
    queryFn: () => getOperationsCancellationsService(filters),
    enabled,
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function useReceivablesSummaryQuery({
  filters,
  enabled = true,
}: {
  filters: AnalyticsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.receivablesSummary(filters),
    queryFn: () => getReceivablesSummaryService(filters),
    enabled,
    staleTime: ANALYTICS_STALE_TIME,
  })
}

export function useReceivablesAgingQuery({
  filters,
  enabled = true,
}: {
  filters: AnalyticsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesAnalyticsQueryKeys.receivablesAging(filters),
    queryFn: () => getReceivablesAgingService(filters),
    enabled,
    staleTime: ANALYTICS_STALE_TIME,
  })
}
