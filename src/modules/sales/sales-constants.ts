import type {
  BudgetClosureSituation,
  SaleStatus,
  SaleType,
} from "@/modules/sales/sales-enums"
import type {
  CompareMode,
  Granularity,
  PeriodPreset,
} from "@/modules/sales/sales-analytics.schema"

export const SALES_BASE_PATH = "/sales"
export const SALES_DASHBOARD_PATH = "/sales/dashboard"

export const DEFAULT_SALES_PAGE_SIZE = 20
export const DEFAULT_ANALYTICS_TIMEZONE = "America/Sao_Paulo"

export function defaultSalesFilters() {
  return {
    limit: DEFAULT_SALES_PAGE_SIZE,
    offset: 0,
    type: undefined as SaleType | undefined,
    status: undefined as SaleStatus | undefined,
    budgetClosureSituation: undefined as BudgetClosureSituation | undefined,
    userId: undefined as string | undefined,
    orderNumber: undefined as string | undefined,
    seller: undefined as string | undefined,
    client: undefined as string | undefined,
  }
}

export function defaultDashboardFilters() {
  return {
    periodPreset: "this_month" as PeriodPreset,
    compareMode: "previous_period" as CompareMode,
    timezone: DEFAULT_ANALYTICS_TIMEZONE,
    granularity: "day" as Granularity,
    userId: undefined as string | undefined,
    dateFrom: undefined as string | undefined,
    dateTo: undefined as string | undefined,
  }
}

export type DashboardFilters = ReturnType<typeof defaultDashboardFilters>

export type SalesDateFilters = {
  dateFrom?: string
  dateTo?: string
}

export function defaultSalesDateFilters(): SalesDateFilters {
  return {
    dateFrom: undefined,
    dateTo: undefined,
  }
}

export function hasActiveSalesDateFilters(filters: SalesDateFilters): boolean {
  return Boolean(filters.dateFrom?.trim() || filters.dateTo?.trim())
}
