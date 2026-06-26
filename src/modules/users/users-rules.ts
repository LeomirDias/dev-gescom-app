import { z } from "zod"
import type { ListUsersQuery } from "@/modules/users/users.schema"
import type { User } from "@/modules/users/users.schema"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import {
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
  parseMembershipSearchTerm,
  type ParsedMembershipSearch,
} from "@/modules/memberships/memberships-rules"

export type UsersDraftFilters = {
  name: string
  registration: string
  email: string
  phone: string
}

export function defaultUsersDraftFilters(): UsersDraftFilters {
  return { name: "", registration: "", email: "", phone: "" }
}

/** Limite maximo enviado na listagem da API (uma unica requisicao). */
export const USERS_API_LIST_LIMIT = 100

/** Tamanho de cada pagina na interface. */
export const USERS_UI_PAGE_SIZE = 50

/**
 * Maximo de paginas ao percorrer toda a API em busca por nome.
 * Com pageSize 100 → ate 1000 usuárioes.
 *
 * Diferente da lista de membros (`use-members-list-filters`), que carrega
 * apenas uma pagina e filtra localmente.
 */
export const USERS_MAX_FETCH_PAGES = 10

export function usersNameSearchLimitWarning(): string {
  const maxUsers = USERS_API_LIST_LIMIT * USERS_MAX_FETCH_PAGES
  return `Busca por nome limitada aos primeiros ${maxUsers} usuárioes carregados da API.`
}

/** @deprecated Use usersNameSearchLimitWarning() para texto com teto atualizado. */
export const USERS_NAME_SEARCH_LIMIT_WARNING = usersNameSearchLimitWarning()

export function defaultUsersListFilters(): ListUsersQuery {
  return { limit: USERS_API_LIST_LIMIT, offset: 0 }
}

const emailSchema = z.string().trim().email()

/** Aviso quando a busca por nome depende de filtro local. */
export function usersNameSearchBannerMessage(truncated: boolean): string {
  const base = usersNameSearchLimitWarning()
  return truncated
    ? `${base} A listagem foi truncada pelo limite de páginas.`
    : base
}

/** Converte termo unificado de busca em query da API (nome usa paginação completa). */
export function searchTermToUsersQuery(
  term: string
): { query: ListUsersQuery; error?: string; searchByName?: string; warning?: string } {
  const parsed = parseMembershipSearchTerm(term)
  const base = defaultUsersListFilters()

  switch (parsed.kind) {
    case "empty":
      return { query: base }
    case "email": {
      const valid = emailSchema.safeParse(parsed.email)
      if (!valid.success) {
        return { query: base, error: "E-mail inválido." }
      }
      return { query: { ...base, email: valid.data } }
    }
    case "registration": {
      const valid = cpfCnpjSchema.safeParse(parsed.registration)
      if (!valid.success) {
        return { query: base, error: "CPF/CNPJ inválido." }
      }
      return { query: { ...base, registration: valid.data } }
    }
    case "phone": {
      const valid = phoneE164Schema.safeParse(parsed.phone)
      if (!valid.success) {
        return {
          query: base,
          error: "Telefone inválido. Use o formato (DD) 9XXXX-XXXX.",
        }
      }
      return { query: { ...base, phone: valid.data } }
    }
    case "name":
      if (parsed.name.length < 2) {
        return {
          query: base,
          error: "Informe ao menos 2 caracteres para buscar por nome.",
        }
      }
      return {
        query: base,
        searchByName: parsed.name,
        warning: usersNameSearchLimitWarning(),
      }
  }
}

export function getNameFromParsedSearch(
  parsed: ParsedMembershipSearch
): string {
  return parsed.kind === "name" ? parsed.name : ""
}

/** Converte filtros do formulário de busca em query da API. */
export function usersDraftFiltersToQuery(draft: UsersDraftFilters): {
  query: ListUsersQuery
  error?: string
  searchByName?: string
  warning?: string
} {
  const name = draft.name.trim()
  const registrationRaw = draft.registration.trim()
  const emailRaw = draft.email.trim()
  const phoneRaw = draft.phone.trim()
  const base = defaultUsersListFilters()

  if (name.length > 0 && name.length < 2) {
    return {
      query: base,
      error: "Informe ao menos 2 caracteres para buscar por nome.",
    }
  }

  const query: ListUsersQuery = { ...base }

  if (registrationRaw) {
    const valid = cpfCnpjSchema.safeParse(normalizeRegistration(registrationRaw))
    if (!valid.success) {
      return { query: base, error: "CPF/CNPJ inválido." }
    }
    query.registration = valid.data
  }

  if (emailRaw) {
    const valid = emailSchema.safeParse(normalizeEmail(emailRaw))
    if (!valid.success) {
      return { query: base, error: "E-mail inválido." }
    }
    query.email = valid.data
  }

  if (phoneRaw) {
    const valid = phoneE164Schema.safeParse(normalizePhone(phoneRaw))
    if (!valid.success) {
      return {
        query: base,
        error: "Telefone inválido. Use o formato (DD) 9XXXX-XXXX.",
      }
    }
    query.phone = valid.data
  }

  if (name.length >= 2) {
    return {
      query,
      searchByName: name,
      warning: usersNameSearchLimitWarning(),
    }
  }

  return { query }
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
