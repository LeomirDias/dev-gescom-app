import { z } from "zod"

export function normalizePhoneToE164(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ""

  const onlyDigits = trimmed.replace(/\D/g, "")
  if (!onlyDigits) return ""

  if (trimmed.startsWith("+")) {
    return `+${onlyDigits}`
  }

  if (onlyDigits.length === 10 || onlyDigits.length === 11) {
    return `+55${onlyDigits}`
  }

  if (onlyDigits.startsWith("55") && onlyDigits.length >= 12) {
    return `+${onlyDigits}`
  }

  return `+${onlyDigits}`
}

/**
 * E.164: +<country><number>. Ex.: +5511999999999
 * Mantém faixa ampla (8..20 dígitos) para compatibilidade com a API.
 */
export const phoneE164Schema = z
  .string()
  .trim()
  .regex(/^\+\d{8,20}$/, "Telefone deve estar no formato E.164 (ex.: +5511999999999).")

/** Telefone vindo da API (8–20 caracteres, com ou sem +); normaliza para E.164 no parse. */
export const apiPhoneSchema = z
  .string()
  .transform(normalizePhoneToE164)
  .pipe(phoneE164Schema)

