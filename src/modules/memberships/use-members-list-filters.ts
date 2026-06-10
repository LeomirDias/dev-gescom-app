"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"
import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"
import {
  parseMembershipSearchTerm,
  type ParsedMembershipSearch,
} from "@/modules/memberships/memberships-rules"

const MEMBERS_NAME_SEARCH_LIMIT = 100
const emailSchema = z.string().trim().email()

function buildSearchFilters(
  parsed: ParsedMembershipSearch,
  draftFilters: ListMembersQuery,
  defaults: ListMembersQuery
): ListMembersQuery | null {
  const base: ListMembersQuery = {
    ...defaults,
    status: draftFilters.status,
    class: draftFilters.class ?? defaults.class,
    limit:
      parsed.kind === "name"
        ? MEMBERS_NAME_SEARCH_LIMIT
        : (draftFilters.limit ?? defaults.limit),
    offset: 0,
    registration: undefined,
    email: undefined,
    phone: undefined,
  }

  switch (parsed.kind) {
    case "empty":
      return base
    case "email": {
      const valid = emailSchema.safeParse(parsed.email)
      if (!valid.success) {
        toast.error("E-mail inválido.")
        return null
      }
      return { ...base, email: valid.data }
    }
    case "registration": {
      const valid = cpfCnpjSchema.safeParse(parsed.registration)
      if (!valid.success) {
        toast.error("CPF/CNPJ inválido.")
        return null
      }
      return { ...base, registration: valid.data }
    }
    case "phone": {
      const valid = phoneE164Schema.safeParse(parsed.phone)
      if (!valid.success) {
        toast.error("Telefone inválido. Use o formato (DD) 9XXXX-XXXX.")
        return null
      }
      return { ...base, phone: valid.data }
    }
    case "name":
      if (parsed.name.length < 2) {
        toast.error("Informe ao menos 2 caracteres para buscar por nome.")
        return null
      }
      return base
  }
}

export function useMembersListFilters(config: MembershipRouteConfig) {
  const router = useRouter()
  const defaults = useMemo(() => config.defaultListFilters(), [config])

  const [searchTerm, setSearchTerm] = useState("")
  const [clientNameFilter, setClientNameFilter] = useState<string | undefined>()
  const [draftFilters, setDraftFilters] = useState<ListMembersQuery>(defaults)
  const [appliedFilters, setAppliedFilters] =
    useState<ListMembersQuery>(defaults)

  const applySearch = useCallback((): boolean => {
    const parsed = parseMembershipSearchTerm(searchTerm)
    const next = buildSearchFilters(parsed, draftFilters, defaults)
    if (!next) return false

    setClientNameFilter(parsed.kind === "name" ? parsed.name : undefined)
    setAppliedFilters(next)
    return true
  }, [searchTerm, draftFilters, defaults])

  const applyFilters = useCallback((): boolean => {
    const parsed = parseMembershipSearchTerm(searchTerm)
    const next = buildSearchFilters(parsed, draftFilters, defaults)
    if (!next) return false

    setClientNameFilter(parsed.kind === "name" ? parsed.name : undefined)
    setAppliedFilters(next)
    return true
  }, [searchTerm, draftFilters, defaults])

  const handleSearchResult = useCallback(
    (items: { id: string }[]) => {
      if (items.length === 1) {
        router.push(`/members/${items[0].id}`)
      }
    },
    [router]
  )

  const clearFilters = useCallback(() => {
    const reset = config.defaultListFilters()
    setSearchTerm("")
    setClientNameFilter(undefined)
    setDraftFilters(reset)
    setAppliedFilters(reset)
  }, [config])

  const setPageOffset = useCallback((offset: number) => {
    setAppliedFilters((filters) => ({ ...filters, offset }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setDraftFilters((f) => ({ ...f, limit }))
    setAppliedFilters((f) => ({ ...f, limit, offset: 0 }))
  }, [])

  return {
    searchTerm,
    setSearchTerm,
    clientNameFilter,
    draftFilters,
    setDraftFilters,
    appliedFilters,
    applySearch,
    applyFilters,
    handleSearchResult,
    clearFilters,
    setPageOffset,
    setLimit,
  }
}
