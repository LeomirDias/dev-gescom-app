import { z } from "zod"

export const paginationSchema = z.object({
  total: z.number().int().min(0),
  limit: z.number().int().min(1),
  offset: z.number().int().min(0),
})

export type Pagination = z.infer<typeof paginationSchema>

export function successEnvelopeSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.literal(true),
    message: z.string(),
    data: dataSchema,
  })
}

export function paginatedEnvelopeSchema<T extends z.ZodTypeAny>(
  itemSchema: T
) {
  return z.object({
    success: z.literal(true),
    message: z.string(),
    data: z.array(itemSchema),
    pagination: paginationSchema,
  })
}

