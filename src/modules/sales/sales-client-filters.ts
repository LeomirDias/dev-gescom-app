import type { SalesDateFilters } from "@/modules/sales/sales-constants"
import type { SaleSummary } from "@/modules/sales/sales.schema"

function toDateOnly(value: string): string {
  return value.slice(0, 10)
}

function getSaleDate(item: SaleSummary): string {
  return toDateOnly(item.completedionDate ?? item.createdAt)
}

function matchesDateRange(
  item: SaleSummary,
  dateFrom?: string,
  dateTo?: string
): boolean {
  const saleDate = getSaleDate(item)
  if (dateFrom && saleDate < dateFrom) return false
  if (dateTo && saleDate > dateTo) return false
  return true
}

export function filterSalesItemsByDate(
  items: SaleSummary[],
  filters: SalesDateFilters
): SaleSummary[] {
  const dateFrom = filters.dateFrom?.trim() || undefined
  const dateTo = filters.dateTo?.trim() || undefined

  if (!dateFrom && !dateTo) return items

  return items.filter((item) => matchesDateRange(item, dateFrom, dateTo))
}
