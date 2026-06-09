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
  convertBudgetToSaleRequestSchema,
  createFullReturnRequestSchema,
  createPartialReturnRequestSchema,
  createSaleItemRequestSchema,
  createSaleRequestSchema,
  paymentTypeSchema,
  saleDetailSchema,
  saleItemSchema,
  saleReturnDetailSchema,
  saleReturnSchema,
  saleSummarySchema,
  updateSaleItemRequestSchema,
  updateSaleRequestSchema,
  type ConvertBudgetToSaleRequest,
  type CreateFullReturnRequest,
  type CreatePartialReturnRequest,
  type CreateSaleItemRequest,
  type CreateSaleRequest,
  type ListPaymentTypesQuery,
  type ListSalesQuery,
  type UpdateSaleItemRequest,
  type UpdateSaleRequest,
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

export async function createSaleService(input: CreateSaleRequest) {
  const body = createSaleRequestSchema.parse(input)
  const raw = await apiFetch<unknown>("sales", { method: "POST", body })
  return successEnvelopeSchema(saleDetailSchema).parse(raw).data
}

export async function updateSaleService(
  saleId: string,
  input: UpdateSaleRequest
) {
  const body = updateSaleRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`sales/${saleId}`, {
    method: "PATCH",
    body,
  })
  return successEnvelopeSchema(saleDetailSchema).parse(raw).data
}

export async function recalculateTotalsService(saleId: string) {
  const raw = await apiFetch<unknown>(`sales/${saleId}/recalculate-totals`, {
    method: "POST",
  })
  return successEnvelopeSchema(saleDetailSchema).parse(raw).data
}

export async function convertToSaleService(
  saleId: string,
  input: ConvertBudgetToSaleRequest
) {
  const body = convertBudgetToSaleRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`sales/${saleId}/convert-to-sale`, {
    method: "POST",
    body,
  })
  return successEnvelopeSchema(saleDetailSchema).parse(raw).data
}

export async function addSaleItemService(
  saleId: string,
  input: CreateSaleItemRequest
) {
  const body = createSaleItemRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`sales/${saleId}/items`, {
    method: "POST",
    body,
  })
  return successEnvelopeSchema(saleItemSchema).parse(raw).data
}

export async function updateSaleItemService(
  saleId: string,
  saleItemId: string,
  input: UpdateSaleItemRequest
) {
  const body = updateSaleItemRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`sales/${saleId}/items/${saleItemId}`, {
    method: "PATCH",
    body,
  })
  return successEnvelopeSchema(saleItemSchema).parse(raw).data
}

export async function removeSaleItemService(saleId: string, saleItemId: string) {
  await apiFetch<unknown>(`sales/${saleId}/items/${saleItemId}`, {
    method: "DELETE",
  })
}

export async function createPartialReturnService(
  saleId: string,
  input: CreatePartialReturnRequest
) {
  const body = createPartialReturnRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`sales/${saleId}/returns/partial`, {
    method: "POST",
    body,
  })
  return successEnvelopeSchema(saleReturnDetailSchema).parse(raw).data
}

export async function createFullReturnService(
  saleId: string,
  input: CreateFullReturnRequest = {}
) {
  const body = createFullReturnRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`sales/${saleId}/returns/full`, {
    method: "POST",
    body,
  })
  return successEnvelopeSchema(saleReturnDetailSchema).parse(raw).data
}
