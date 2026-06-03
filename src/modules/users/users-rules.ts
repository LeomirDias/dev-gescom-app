import type { ListUsersQuery } from "@/modules/users/users.schema"
import type { User } from "@/modules/users/users.schema"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import {
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
} from "@/modules/memberships/memberships-rules"

/** Limite maximo enviado na listagem da API (uma unica requisicao). */
export const USERS_API_LIST_LIMIT = 100

/** Tamanho de cada pagina na interface. */
export const USERS_UI_PAGE_SIZE = 50

export function defaultUsersListFilters(): ListUsersQuery {
  return { limit: USERS_API_LIST_LIMIT, offset: 0 }
}

export type LinkUsersDraftFilters = {
  name: string
  registration: string
  email: string
  phone: string
}

export function emptyLinkUsersDraftFilters(): LinkUsersDraftFilters {
  return { name: "", registration: "", email: "", phone: "" }
}

/** Converte rascunho do formulario em query da API (nome e filtrado no cliente). */
export function draftFiltersToUsersQuery(
  draft: LinkUsersDraftFilters
): ListUsersQuery {
  const registrationRaw = normalizeRegistration(draft.registration)
  const email = draft.email.trim() ? normalizeEmail(draft.email) : undefined
  const phoneRaw = draft.phone.trim() ? normalizePhone(draft.phone) : ""

  let registration: string | undefined
  if (registrationRaw.length >= 11) {
    const parsed = cpfCnpjSchema.safeParse(registrationRaw)
    registration = parsed.success ? parsed.data : undefined
  }

  let phone: string | undefined
  if (phoneRaw) {
    const parsed = phoneE164Schema.safeParse(phoneRaw)
    phone = parsed.success ? parsed.data : undefined
  }

  return {
    ...defaultUsersListFilters(),
    registration,
    email,
    phone,
  }
}

export function filterUsersByName(items: User[], name: string): User[] {
  const term = name.trim().toLowerCase()
  if (!term) return items
  return items.filter((u) => u.userName.toLowerCase().includes(term))
}

export function paginateUsers<T>(
  items: T[],
  offset: number,
  limit: number = USERS_UI_PAGE_SIZE
): T[] {
  return items.slice(offset, offset + limit)
}
