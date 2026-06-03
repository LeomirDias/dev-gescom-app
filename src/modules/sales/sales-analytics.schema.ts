import { z } from "zod"

export const periodPresetSchema = z.enum([
  "today",
  "yesterday",
  "this_week",
  "last_week",
  "this_month",
  "last_month",
  "this_quarter",
  "last_quarter",
  "this_year",
  "last_year",
])

export type PeriodPreset = z.infer<typeof periodPresetSchema>

export const compareModeSchema = z.enum([
  "none",
  "previous_period",
  "previous_year",
])

export type CompareMode = z.infer<typeof compareModeSchema>

export const granularitySchema = z.enum(["day", "week", "month", "year"])
export type Granularity = z.infer<typeof granularitySchema>

export const topProductsSortBySchema = z.enum(["revenue", "quantity"])
export type TopProductsSortBy = z.infer<typeof topProductsSortBySchema>

export const analyticsQuerySchema = z
  .object({
    periodPreset: periodPresetSchema.optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    timezone: z.string().optional(),
    compareMode: compareModeSchema.optional(),
    userId: z.uuid().optional(),
    memberId: z.uuid().optional(),
    paymentTypeId: z.uuid().optional(),
    productsEnterprisesId: z.uuid().optional(),
    productGroupId: z.uuid().optional(),
    granularity: granularitySchema.optional(),
    limit: z.coerce.number().int().min(1).max(50).optional(),
    sortBy: topProductsSortBySchema.optional(),
  })
  .strict()

export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>

export const periodRangeSchema = z.object({
  from: z.string(),
  to: z.string(),
})

export const periodInfoSchema = periodRangeSchema.extend({
  timezone: z.string(),
})

export type PeriodInfo = z.infer<typeof periodInfoSchema>

/** Período de comparação devolvido pela API (sem timezone no envelope). */
export const comparisonPeriodInfoSchema = periodRangeSchema.extend({
  mode: compareModeSchema,
})

export type ComparisonPeriodInfo = z.infer<typeof comparisonPeriodInfoSchema>

export const kpiValueSchema = z.object({
  value: z.number(),
  previousValue: z.number().optional(),
  changePercent: z.number().optional(),
})

export type KpiValue = z.infer<typeof kpiValueSchema>

export const returnsKpiSchema = kpiValueSchema.extend({
  returnCount: z.number().optional(),
})

export type ReturnsKpi = z.infer<typeof returnsKpiSchema>

export const realizedOverviewSchema = z.object({
  period: periodInfoSchema,
  comparison: comparisonPeriodInfoSchema.optional(),
  kpis: z.object({
    grossRevenue: kpiValueSchema,
    netRevenue: kpiValueSchema,
    salesCount: kpiValueSchema,
    averageTicket: kpiValueSchema,
    itemsSold: kpiValueSchema,
    discountTotal: kpiValueSchema,
    returnsTotal: returnsKpiSchema,
    pieRevenue: z.object({ value: z.number() }),
    serviceRevenue: z.object({ value: z.number() }),
  }),
})

export type RealizedOverview = z.infer<typeof realizedOverviewSchema>

export const realizedKpisFlatSchema = z.object({
  grossRevenue: z.number(),
  netRevenue: z.number(),
  salesCount: z.number(),
  averageTicket: z.number(),
  itemsSold: z.number(),
  discountTotal: z.number(),
  returnsTotal: z.number(),
  returnCount: z.number().optional(),
  pieRevenue: z.number(),
  serviceRevenue: z.number(),
})

export type RealizedKpisFlat = z.infer<typeof realizedKpisFlatSchema>

export const realizedCompareSchema = z.object({
  period: periodInfoSchema,
  comparisonPeriod: comparisonPeriodInfoSchema,
  current: realizedKpisFlatSchema,
  comparison: realizedKpisFlatSchema,
  deltas: z.record(z.string(), z.number()),
})

export type RealizedCompare = z.infer<typeof realizedCompareSchema>

export const timeseriesPointSchema = z.object({
  bucketStart: z.string(),
  bucketLabel: z.string(),
  grossRevenue: z.number().optional(),
  netRevenue: z.number().optional(),
  salesCount: z.number().optional(),
  returnsTotal: z.number().optional(),
  openSalesValue: z.number().optional(),
  openBudgetsValue: z.number().optional(),
  openSalesCount: z.number().optional(),
  openBudgetsCount: z.number().optional(),
})

export type TimeseriesPoint = z.infer<typeof timeseriesPointSchema>

export const realizedTimeseriesSchema = z.object({
  period: periodInfoSchema,
  granularity: granularitySchema,
  series: z.array(timeseriesPointSchema),
  comparisonSeries: z.array(timeseriesPointSchema).optional(),
})

export type RealizedTimeseries = z.infer<typeof realizedTimeseriesSchema>

export const pipelineTimeseriesSchema = z.object({
  period: periodInfoSchema,
  granularity: granularitySchema,
  series: z.array(timeseriesPointSchema),
  comparisonSeries: z.array(timeseriesPointSchema).optional(),
})

export type PipelineTimeseries = z.infer<typeof pipelineTimeseriesSchema>

export const rankingItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  revenue: z.number(),
  salesCount: z.number().optional(),
  quantity: z.number().optional(),
  sharePercent: z.number(),
})

export type RankingItem = z.infer<typeof rankingItemSchema>

export const rankingResponseSchema = z.object({
  period: periodInfoSchema,
  items: z.array(rankingItemSchema),
  totalRevenue: z.number(),
})

export type RankingResponse = z.infer<typeof rankingResponseSchema>

export const topProductItemSchema = z.object({
  id: z.uuid(),
  code: z.number().int().nullable(),
  label: z.string(),
  revenue: z.number(),
  quantity: z.number(),
  salesCount: z.number(),
  sharePercent: z.number(),
})

export type TopProductItem = z.infer<typeof topProductItemSchema>

export const topProductsResponseSchema = z.object({
  period: periodInfoSchema,
  items: z.array(topProductItemSchema),
  totalRevenue: z.number(),
})

export type TopProductsResponse = z.infer<typeof topProductsResponseSchema>

export const returnsAnalyticsSchema = z.object({
  period: periodInfoSchema,
  returnsTotal: z.number(),
  returnCount: z.number(),
  returnRatePercent: z.number(),
  topReturnedProducts: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      quantity: z.number(),
      revenue: z.number(),
    })
  ),
})

export type ReturnsAnalytics = z.infer<typeof returnsAnalyticsSchema>

export const pipelineKpisSchema = z.object({
  openSalesCount: z.number(),
  openSalesValue: z.number(),
  openBudgetsCount: z.number(),
  openBudgetsValue: z.number(),
  budgetsPartialCount: z.number(),
  budgetsClosedCount: z.number(),
  conversionCountInPeriod: z.number(),
  conversionRatePercent: z.number(),
})

export type PipelineKpis = z.infer<typeof pipelineKpisSchema>

export const pipelineOverviewSchema = z.object({
  period: periodInfoSchema,
  comparison: comparisonPeriodInfoSchema.optional(),
  kpis: pipelineKpisSchema,
})

export type PipelineOverview = z.infer<typeof pipelineOverviewSchema>

export const pipelineCompareSchema = z.object({
  period: periodInfoSchema,
  comparisonPeriod: comparisonPeriodInfoSchema,
  current: pipelineKpisSchema,
  comparison: pipelineKpisSchema,
  deltas: z.record(z.string(), z.number()),
})

export type PipelineCompare = z.infer<typeof pipelineCompareSchema>

export const pipelineBudgetsSchema = z.object({
  period: periodInfoSchema,
  budgetsCount: z.number(),
  budgetsTotalValue: z.number(),
  openBudgetsValue: z.number(),
  convertedValue: z.number(),
  conversionCount: z.number(),
  conversionRatePercent: z.number(),
  avgConversionDays: z.number(),
})

export type PipelineBudgets = z.infer<typeof pipelineBudgetsSchema>

export const budgetFunnelItemSchema = z.object({
  situation: z.enum(["ABERTO", "PARCIAL", "FECHADO"]),
  count: z.number(),
  value: z.number(),
  sharePercent: z.number(),
})

export type BudgetFunnelItem = z.infer<typeof budgetFunnelItemSchema>

export const budgetFunnelSchema = z.object({
  period: periodInfoSchema,
  funnel: z.array(budgetFunnelItemSchema),
  totalCount: z.number(),
  totalValue: z.number(),
})

export type BudgetFunnel = z.infer<typeof budgetFunnelSchema>

export const statusBreakdownItemSchema = z.object({
  type: z.enum(["VENDA", "ORCAMENTO"]),
  status: z.enum(["ABERTA", "FINALIZADA", "CANCELADA"]),
  count: z.number(),
  value: z.number(),
})

export type StatusBreakdownItem = z.infer<typeof statusBreakdownItemSchema>

export const statusBreakdownSchema = z.object({
  period: periodInfoSchema,
  breakdown: z.array(statusBreakdownItemSchema),
})

export type StatusBreakdown = z.infer<typeof statusBreakdownSchema>

export const cancellationSeriesPointSchema = z.object({
  bucketStart: z.string(),
  count: z.number(),
  lostValue: z.number(),
})

export type CancellationSeriesPoint = z.infer<
  typeof cancellationSeriesPointSchema
>

export const cancellationsAnalyticsSchema = z.object({
  period: periodInfoSchema,
  cancellationCount: z.number(),
  lostValue: z.number(),
  series: z.array(cancellationSeriesPointSchema),
})

export type CancellationsAnalytics = z.infer<
  typeof cancellationsAnalyticsSchema
>

export const receivablesSummarySchema = z.object({
  totalOutstanding: z.number(),
  dueCount: z.number(),
  overdueTotal: z.number(),
  overdueCount: z.number(),
  upcomingTotal: z.number(),
  upcomingCount: z.number(),
})

export type ReceivablesSummary = z.infer<typeof receivablesSummarySchema>

export const agingBucketSchema = z.object({
  bucket: z.enum([
    "a_vencer",
    "vencido_1_30",
    "vencido_31_60",
    "vencido_60_plus",
  ]),
  total: z.number(),
  count: z.number(),
  sharePercent: z.number(),
})

export type AgingBucket = z.infer<typeof agingBucketSchema>

export const receivablesAgingSchema = z.object({
  buckets: z.array(agingBucketSchema),
  totalAmount: z.number(),
})

export type ReceivablesAging = z.infer<typeof receivablesAgingSchema>

export function buildAnalyticsQuery(query: AnalyticsQuery): string {
  const parsed = analyticsQuerySchema.parse(query)
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(parsed)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value))
    }
  }

  const qs = params.toString()
  return qs ? `?${qs}` : ""
}
