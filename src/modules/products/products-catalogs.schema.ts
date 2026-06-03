import { z } from "zod"
import {
  decimalSchema,
  paginationQuerySchema,
  searchPaginationQuerySchema,
} from "@/modules/products/products-query"

export const unitSchema = z.object({
  id: z.uuid(),
  unit: z.string(),
  description: z.string(),
  compatible: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type Unit = z.infer<typeof unitSchema>

export const typeProductSchema = z.object({
  id: z.uuid(),
  type: z.string(),
  description: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type TypeProduct = z.infer<typeof typeProductSchema>

export const productNcmSchema = z.object({
  id: z.uuid(),
  ncm: z.string(),
  description: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type ProductNcm = z.infer<typeof productNcmSchema>

export const productCestSchema = z.object({
  id: z.uuid(),
  cest: z.string(),
  description: z.string(),
  productsNcmId: z.uuid(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type ProductCest = z.infer<typeof productCestSchema>

export const productAnpSchema = z.object({
  id: z.uuid(),
  anp: z.string(),
  description: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type ProductAnp = z.infer<typeof productAnpSchema>

export const productNbsSchema = z.object({
  id: z.uuid(),
  lc116Item: z.string().nullable().optional(),
  lc116Description: z.string().nullable().optional(),
  nbs: z.string(),
  description: z.string(),
  psOnerosa: z.enum(["S", "N"]).optional(),
  adqExterior: z.enum(["S", "N"]).optional(),
  indop: z.string().nullable().optional(),
  cClassTrib: z.string().nullable().optional(),
  cClassTribName: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type ProductNbs = z.infer<typeof productNbsSchema>

export const listProductNbsQuerySchema = searchPaginationQuerySchema

export type ListProductNbsQuery = z.infer<typeof listProductNbsQuerySchema>

export const icmsTaxationSchema = z.object({
  id: z.uuid(),
  icms: z.string(),
  description: z.string(),
  icmsRate: decimalSchema.nullable().optional(),
  simplesIcmsRate: decimalSchema.nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type IcmsTaxation = z.infer<typeof icmsTaxationSchema>

export const productGroupSchema = z.object({
  id: z.uuid(),
  description: z.string(),
  profitMargin: decimalSchema.nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type ProductGroup = z.infer<typeof productGroupSchema>

export const productSubgroupSchema = z.object({
  id: z.uuid(),
  description: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type ProductSubgroup = z.infer<typeof productSubgroupSchema>

export const productBrandSchema = z.object({
  id: z.uuid(),
  description: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type ProductBrand = z.infer<typeof productBrandSchema>

export const pisCofinsSituationSchema = z.object({
  id: z.uuid(),
  cst: z.string(),
  description: z.string(),
  type: z.enum(["ENTRADA", "SAIDA"]),
  framing: z.number().int(),
  pisRate: decimalSchema.nullable().optional(),
  cofinsRate: decimalSchema.nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type PisCofinsSituation = z.infer<typeof pisCofinsSituationSchema>

export { paginationQuerySchema }
