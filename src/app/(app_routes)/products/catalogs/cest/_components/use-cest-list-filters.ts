"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"

import {
  defaultCestDraftFilters,
  defaultCestFilters,
  CEST_CLIENT_SEARCH_LIMIT,
  type CestDraftFilters,
} from "@/app/(app_routes)/products/catalogs/cest/_components/cest-constants"
import type { PaginationQuery } from "@/modules/products/products-query"

function hasAnySearchCriteria(draft: CestDraftFilters): boolean {
  return (
    draft.cest.trim().length > 0 || draft.description.trim().length > 0
  )
}

function buildApiFilters(draft: CestDraftFilters, defaults: PaginationQuery) {
  const needsClientFetch = hasAnySearchCriteria(draft)

  return {
    filters: {
      ...defaults,
      limit: needsClientFetch
        ? CEST_CLIENT_SEARCH_LIMIT
        : (defaults.limit ?? 50),
      offset: 0,
    },
    usesClientPagination: needsClientFetch,
    clientCriteria: { cest: draft.cest, description: draft.description },
  }
}

export function useCestListFilters() {
  const defaults = defaultCestFilters()

  const [draftFilters, setDraftFilters] = useState(defaultCestDraftFilters)
  const [appliedFilters, setAppliedFilters] = useState<PaginationQuery>(defaults)
  const [appliedClientCriteria, setAppliedClientCriteria] =
    useState<CestDraftFilters>(defaultCestDraftFilters())
  const [hasSearched, setHasSearched] = useState(false)
  const [isClientPagination, setIsClientPagination] = useState(false)

  const applySearch = useCallback((): boolean => {
    if (!hasAnySearchCriteria(draftFilters)) {
      toast.error("Informe o CEST e/ou a descrição para buscar.")
      return false
    }

    const { filters, usesClientPagination, clientCriteria } = buildApiFilters(
      draftFilters,
      defaults
    )
    setAppliedFilters(filters)
    setIsClientPagination(usesClientPagination)
    setAppliedClientCriteria(clientCriteria)
    setHasSearched(true)
    return true
  }, [draftFilters, defaults])

  const clearFilters = useCallback(() => {
    setDraftFilters(defaultCestDraftFilters())
    setAppliedFilters(defaultCestFilters())
    setIsClientPagination(false)
    setAppliedClientCriteria(defaultCestDraftFilters())
    setHasSearched(false)
  }, [])

  const setPageOffset = useCallback((offset: number) => {
    setAppliedFilters((filters) => ({ ...filters, offset }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setAppliedFilters((filters) => ({ ...filters, limit, offset: 0 }))
  }, [])

  return {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    appliedClientCriteria,
    hasSearched,
    isClientPagination,
    applySearch,
    clearFilters,
    setPageOffset,
    setLimit,
  }
}
