import { z } from "zod"

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

