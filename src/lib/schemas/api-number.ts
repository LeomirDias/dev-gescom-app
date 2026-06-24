import { z } from "zod"

/** Campos numéricos que a API pode enviar como string (ex.: DECIMAL). */
export const apiNullableNumberSchema = z
  .union([z.number(), z.string()])
  .nullable()
  .optional()
  .transform((v) => {
    if (v === undefined) return undefined
    if (v === null || v === "") return null
    const n = typeof v === "number" ? v : Number(v)
    return Number.isNaN(n) ? null : n
  })
