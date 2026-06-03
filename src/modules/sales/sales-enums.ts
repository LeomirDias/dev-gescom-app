import { z } from "zod"

export const saleTypeSchema = z.enum(["VENDA", "ORCAMENTO"])
export type SaleType = z.infer<typeof saleTypeSchema>

export const saleStatusSchema = z.enum(["ABERTA", "FINALIZADA", "CANCELADA"])
export type SaleStatus = z.infer<typeof saleStatusSchema>

export const budgetClosureSituationSchema = z.enum(["ABERTO", "PARCIAL", "FECHADO"])
export type BudgetClosureSituation = z.infer<typeof budgetClosureSituationSchema>

export const returnSituationSchema = z.enum(["SEM_DEVOLUCAO", "PARCIAL", "TOTAL"])
export type ReturnSituation = z.infer<typeof returnSituationSchema>

export const saleReturnKindSchema = z.enum(["PARCIAL", "TOTAL"])
export type SaleReturnKind = z.infer<typeof saleReturnKindSchema>

export const saleReturnStatusSchema = z.enum([
  "ABERTA",
  "FINALIZADA",
  "CANCELADA",
])
export type SaleReturnStatus = z.infer<typeof saleReturnStatusSchema>

export const paymentTypeStatusSchema = z.enum(["ATIVO", "INATIVO"])
export type PaymentTypeStatus = z.infer<typeof paymentTypeStatusSchema>

export const decimalSchema = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === "number" ? String(v) : v))
