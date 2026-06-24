import { z } from "zod"

import { formatCpfCnpj } from "@/lib/formatters"
import { normalizePhoneToE164, phoneE164Schema } from "@/lib/validation/phone"

function onlyDigits(value: string) {
  return value.replace(/\D/g, "")
}

function allSameDigits(value: string) {
  return /^(\d)\1+$/.test(value)
}

function calcCpfDigit(base: string, factorStart: number) {
  let sum = 0
  for (let i = 0; i < base.length; i++) {
    sum += Number(base[i]) * (factorStart - i)
  }
  const mod = sum % 11
  return mod < 2 ? 0 : 11 - mod
}

export function isValidCpf(value: string) {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11) return false
  if (allSameDigits(cpf)) return false
  const base = cpf.slice(0, 9)
  const d1 = calcCpfDigit(base, 10)
  const d2 = calcCpfDigit(base + String(d1), 11)
  return cpf === base + String(d1) + String(d2)
}

function calcCnpjDigit(base: string, factors: number[]) {
  let sum = 0
  for (let i = 0; i < factors.length; i++) {
    sum += Number(base[i]) * factors[i]!
  }
  const mod = sum % 11
  return mod < 2 ? 0 : 11 - mod
}

export function isValidCnpj(value: string) {
  const cnpj = onlyDigits(value)
  if (cnpj.length !== 14) return false
  if (allSameDigits(cnpj)) return false
  const base = cnpj.slice(0, 12)
  const d1 = calcCnpjDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  const d2 = calcCnpjDigit(
    base + String(d1),
    [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  )
  return cnpj === base + String(d1) + String(d2)
}

export function validateCpfCnpj(value: string) {
  return isValidCpf(value) || isValidCnpj(value)
}

export function expectedCpfFromDigits(value: string): string | null {
  const digits = onlyDigits(value)
  if (digits.length !== 11) return null
  const base = digits.slice(0, 9)
  const d1 = calcCpfDigit(base, 10)
  const d2 = calcCpfDigit(base + String(d1), 11)
  return base + String(d1) + String(d2)
}

/** Mensagem amigável quando o documento falha na validação de CPF/CNPJ. */
export function cpfCnpjValidationMessage(raw: string): string {
  const digits = onlyDigits(raw.trim())
  const parsed = cpfCnpjSchema.safeParse(raw)
  if (parsed.success) return ""

  if (digits.length === 11) {
    const asPhone = phoneE164Schema.safeParse(normalizePhoneToE164(raw))
    if (asPhone.success) {
      return "Este número parece ser um telefone. Informe o CPF ou CNPJ neste campo e o telefone no campo Telefone."
    }

    const expected = expectedCpfFromDigits(digits)
    if (expected && expected !== digits) {
      return `CPF inválido. Verifique os dígitos verificadores (esperado: ${formatCpfCnpj(expected)}).`
    }
  }

  return parsed.error.issues[0]?.message ?? "CPF/CNPJ inválido."
}

export const cpfCnpjSchema = z
  .string()
  .trim()
  .transform((v) => onlyDigits(v))
  .refine((v) => v.length === 11 || v.length === 14, {
    message: "CPF/CNPJ deve ter 11 ou 14 dígitos.",
  })
  .refine((v) => validateCpfCnpj(v), {
    message: "CPF/CNPJ inválido.",
  })

