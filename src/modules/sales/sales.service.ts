import { z } from "zod"

import { apiFetch } from "@/lib/api/client"
import { paginatedEnvelopeSchema, successEnvelopeSchema } from "@/lib/api/envelope"
import {
  buildPaymentTypesQuery,
  buildSalesQuery,
  listPaymentTypesQuerySchema,
  listSalesQuerySchema,
} from "@/modules/sales/sales-query"
import {
  budgetConversionSchema,
  paymentTypeSchema,
  saleDetailSchema,
  saleReturnDetailSchema,
  saleReturnSchema,
  saleSummarySchema,
  type ListPaymentTypesQuery,
  type ListSalesQuery,
} from "@/modules/sales/sales.schema"

export async function listSalesService(query: ListSalesQuery = {}) {
  const parsed = listSalesQuerySchema.parse(query)
  const qs = buildSalesQuery(parsed)
  const raw = await apiFetch<unknown>(`sales${qs}`, { method: "GET" })
  const envelope = paginatedEnvelopeSchema(saleSummarySchema).parse(raw)
  return { items: envelope.data, ...envelope.pagination }
}

export async function getSaleService(saleId: string) {
  const raw = await apiFetch<unknown>(`sales/${saleId}`, { method: "GET" })
  return successEnvelopeSchema(saleDetailSchema).parse(raw).data
}

export async function listSaleReturnsService(saleId: string) {
  const raw = await apiFetch<unknown>(`sales/${saleId}/returns`, {
    method: "GET",
  })
  return successEnvelopeSchema(z.array(saleReturnSchema)).parse(raw).data
}

export async function getSaleReturnService(
  saleId: string,
  salesReturnId: string
) {
  const raw = await apiFetch<unknown>(
    `sales/${saleId}/returns/${salesReturnId}`,
    { method: "GET" }
  )
  return successEnvelopeSchema(saleReturnDetailSchema).parse(raw).data
}

export async function listBudgetConversionsService(saleId: string) {
  const raw = await apiFetch<unknown>(
    `sales/${saleId}/budget-conversions`,
    { method: "GET" }
  )
  return successEnvelopeSchema(z.array(budgetConversionSchema)).parse(raw).data
}

export async function listPaymentTypesService(
  query: ListPaymentTypesQuery = {}
) {
  const parsed = listPaymentTypesQuerySchema.parse(query)
  const qs = buildPaymentTypesQuery(parsed)
  const raw = await apiFetch<unknown>(`payment-types${qs}`, { method: "GET" })
  const envelope = paginatedEnvelopeSchema(paymentTypeSchema).parse(raw)
  return { items: envelope.data, ...envelope.pagination }
}

export async function getPaymentTypeService(paymentTypeId: string) {
  const raw = await apiFetch<unknown>(`payment-types/${paymentTypeId}`, {
    method: "GET",
  })
  return successEnvelopeSchema(paymentTypeSchema).parse(raw).data
}
