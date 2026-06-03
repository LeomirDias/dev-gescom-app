import { z } from "zod"
import {
  paginationQuerySchema,
  searchPaginationQuerySchema,
} from "@/modules/products/products-query"

export const productStatusSchema = z.enum(["ATIVO", "INATIVO"])

export type ProductStatus = z.infer<typeof productStatusSchema>

export const productSchema = z.object({
  id: z.uuid(),
  status: productStatusSchema,
  description: z.string(),
  barCode: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type Product = z.infer<typeof productSchema>

export const listProductsQuerySchema = searchPaginationQuerySchema.extend({
  status: productStatusSchema.optional(),
})

export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>

export const productEnterpriseSchema = z.object({
  id: z.uuid(),
  productId: z.uuid(),
  enterprisesId: z.uuid(),
  code: z.number().int().nullable(),
  description: z.string(),
  origin: z.string().nullable(),
  manufacturer: z.string().nullable(),
  measurementUnitId: z.uuid().nullable().optional(),
  productTypeId: z.uuid().nullable().optional(),
  controlsBatch: z.boolean(),
  status: productStatusSchema,
  barCode: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
})

export type ProductEnterprise = z.infer<typeof productEnterpriseSchema>

export const listProductsEnterprisesQuerySchema = searchPaginationQuerySchema

export type ListProductsEnterprisesQuery = z.infer<
  typeof listProductsEnterprisesQuerySchema
>

export { paginationQuerySchema }
