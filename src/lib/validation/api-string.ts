import { z } from "zod"

/** Converte `""` em `null` antes de validar strings opcionais vindas da API. */
export function apiNullableString(
  constraints: { min?: number; max?: number } = {}
) {
  const min = constraints.min ?? 0
  const max = constraints.max ?? 255

  return z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().min(min).max(max).nullable().optional()
  )
}
