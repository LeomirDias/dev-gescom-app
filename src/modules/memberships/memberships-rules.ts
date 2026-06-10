import { z } from "zod"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import { normalizePhoneToE164 } from "@/lib/validation/phone"
import type { EnterpriseMemberClass } from "@/modules/memberships/memberships.schema"
import type { MemberDepartmentPayload } from "@/modules/memberships/memberships.schema"
import type { MemberListItem } from "@/modules/memberships/memberships.schema"

export const CLIENT_MEMBER_CLASS = "CLIENTE" as const

export function isClienteClass(memberClass: EnterpriseMemberClass): boolean {
  return memberClass === CLIENT_MEMBER_CLASS
}

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function normalizeRegistration(raw: string): string {
  return raw.replace(/\D/g, "")
}

export function normalizePhone(raw: string): string {
  return normalizePhoneToE164(raw)
}

export type ParsedMembershipSearch =
  | { kind: "empty" }
  | { kind: "email"; email: string }
  | { kind: "registration"; registration: string }
  | { kind: "phone"; phone: string }
  | { kind: "name"; name: string }

const emailSchema = z.string().trim().email()

/** Detecta o tipo de busca a partir de um único termo digitado pelo usuário. */
export function parseMembershipSearchTerm(raw: string): ParsedMembershipSearch {
  const trimmed = raw.trim()
  if (!trimmed) return { kind: "empty" }

  if (trimmed.includes("@")) {
    return { kind: "email", email: normalizeEmail(trimmed) }
  }

  const digitsOnly = normalizeRegistration(trimmed)
  const looksNumeric =
    digitsOnly.length > 0 && /^[\d.\-/\s+()]+$/.test(trimmed)

  if (looksNumeric) {
    if (digitsOnly.length === 11 || digitsOnly.length === 14) {
      const parsed = cpfCnpjSchema.safeParse(digitsOnly)
      if (parsed.success) {
        return { kind: "registration", registration: parsed.data }
      }
    }

    if (digitsOnly.length >= 10) {
      const parsed = phoneE164Schema.safeParse(normalizePhone(trimmed))
      if (parsed.success) {
        return { kind: "phone", phone: parsed.data }
      }
    }
  }

  return { kind: "name", name: trimmed }
}

export function filterMembersByName(
  items: MemberListItem[],
  name: string
): MemberListItem[] {
  const term = name.trim().toLowerCase()
  if (!term) return items
  return items.filter((item) =>
    item.user.userName.toLowerCase().includes(term)
  )
}

export type DepartmentsValidationResult =
  | { ok: true }
  | { ok: false; message: string }

export function validateDepartmentsPayload(
  memberClass: EnterpriseMemberClass,
  departments: MemberDepartmentPayload[]
): DepartmentsValidationResult {
  if (isClienteClass(memberClass)) {
    if (departments.length > 0) {
      return {
        ok: false,
        message: "Clientes nao devem ter departamentos.",
      }
    }
    return { ok: true }
  }

  if (departments.length === 0) {
    return {
      ok: false,
      message: "Selecione ao menos um departamento.",
    }
  }

  const mainCount = departments.filter((d) => d.mainDepartment).length
  if (mainCount !== 1) {
    return {
      ok: false,
      message: "Defina exactamente um departamento principal.",
    }
  }

  const ids = new Set<string>()
  for (const d of departments) {
    if (ids.has(d.departmentId)) {
      return {
        ok: false,
        message: "Departamentos duplicados nao sao permitidos.",
      }
    }
    ids.add(d.departmentId)
  }

  return { ok: true }
}
