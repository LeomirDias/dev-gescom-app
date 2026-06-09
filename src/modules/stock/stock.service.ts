import { apiFetch } from "@/lib/api/client"
import { paginatedEnvelopeSchema, successEnvelopeSchema } from "@/lib/api/envelope"
import {
  buildPaginationQuery,
  buildStockMovementsQuery,
  createStockMovementRequestSchema,
  stockBatchBalanceSchema,
  stockBatchSchema,
  stockLocationSchema,
  stockMinMaxSchema,
  stockMovementSchema,
  stockSectorRentalSchema,
  stockSectorSchema,
  type CreateStockMovementRequest,
  type ListStockMovementsQuery,
  type PaginationQuery,
} from "@/modules/stock/stock.schema"

async function listResource<T>(
  path: string,
  query: PaginationQuery,
  schema: import("zod").ZodType<T>
) {
  const qs = buildPaginationQuery(query)
  const raw = await apiFetch<unknown>(`${path}${qs}`, { method: "GET" })
  const envelope = paginatedEnvelopeSchema(schema).parse(raw)
  return { items: envelope.data, ...envelope.pagination }
}

async function getResource<T>(path: string, schema: import("zod").ZodType<T>) {
  const raw = await apiFetch<unknown>(path, { method: "GET" })
  return successEnvelopeSchema(schema).parse(raw).data
}

export async function listStockSectorsService(query: PaginationQuery = {}) {
  return listResource("stock-sectors", query, stockSectorSchema)
}

export async function getStockSectorService(stockSectorId: string) {
  return getResource(`stock-sectors/${stockSectorId}`, stockSectorSchema)
}

export async function listStockLocationsService(query: PaginationQuery = {}) {
  return listResource("stock-locations", query, stockLocationSchema)
}

export async function getStockLocationService(stockLocationId: string) {
  return getResource(`stock-locations/${stockLocationId}`, stockLocationSchema)
}

export async function listStockBatchesService(query: PaginationQuery = {}) {
  return listResource("stock-batches", query, stockBatchSchema)
}

export async function getStockBatchService(stockBatchId: string) {
  return getResource(`stock-batches/${stockBatchId}`, stockBatchSchema)
}

export async function listStockSectorRentalsService(query: PaginationQuery = {}) {
  return listResource("stock-sectors-rental", query, stockSectorRentalSchema)
}

export async function getStockSectorRentalService(stockSectorRentalId: string) {
  return getResource(
    `stock-sectors-rental/${stockSectorRentalId}`,
    stockSectorRentalSchema
  )
}

export async function listStockBatchBalancesService(query: PaginationQuery = {}) {
  return listResource("stock-batch-balances", query, stockBatchBalanceSchema)
}

export async function getStockBatchBalanceService(stockBatchBalanceId: string) {
  return getResource(
    `stock-batch-balances/${stockBatchBalanceId}`,
    stockBatchBalanceSchema
  )
}

export async function listStockMinMaxService(query: PaginationQuery = {}) {
  return listResource("stock-min-max", query, stockMinMaxSchema)
}

export async function getStockMinMaxService(stockMinMaxId: string) {
  return getResource(`stock-min-max/${stockMinMaxId}`, stockMinMaxSchema)
}

export async function listStockMovementsService(
  query: ListStockMovementsQuery = {}
) {
  const qs = buildStockMovementsQuery(query)
  const raw = await apiFetch<unknown>(`stock-movements${qs}`, { method: "GET" })
  const envelope = paginatedEnvelopeSchema(stockMovementSchema).parse(raw)
  return { items: envelope.data, ...envelope.pagination }
}

export async function getStockMovementService(stockMovementId: string) {
  return getResource(`stock-movements/${stockMovementId}`, stockMovementSchema)
}

export async function createStockMovementService(
  input: CreateStockMovementRequest
) {
  const body = createStockMovementRequestSchema.parse(input)
  const raw = await apiFetch<unknown>("stock-movements", {
    method: "POST",
    body,
  })
  return successEnvelopeSchema(stockMovementSchema).parse(raw).data
}
