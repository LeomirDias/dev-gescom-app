import { z } from "zod"

export const paginationQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>

export const searchPaginationQuerySchema = paginationQuerySchema.extend({
  search: z.string().trim().min(1).optional(),
})

export type SearchPaginationQuery = z.infer<typeof searchPaginationQuerySchema>

type QueryParamsInput = PaginationQuery & {
  search?: string
  status?: string
}

export function buildPaginationQuery(query: QueryParamsInput): string {
  const params = new URLSearchParams()
  if (query.limit !== undefined) params.set("limit", String(query.limit))
  if (query.offset !== undefined) params.set("offset", String(query.offset))
  if (query.search !== undefined && query.search.length > 0) {
    params.set("search", query.search)
  }
  if (query.status !== undefined) {
    params.set("status", query.status)
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export const decimalSchema = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === "number" ? String(v) : v))
