"use client"

import { useCallback, useState } from "react"
import { toast } from "sonner"

import {
  defaultNcmDraftFilters,
  defaultNcmFilters,
  NCM_CLIENT_SEARCH_LIMIT,
  type NcmDraftFilters,
} from "@/app/(app_routes)/products/catalogs/ncm/_components/ncm-constants"
import type { PaginationQuery } from "@/modules/products/products-query"

function hasAnySearchCriteria(draft: NcmDraftFilters): boolean {
  return (
    draft.ncm.trim().length > 0 || draft.description.trim().length > 0
  )
}

function buildApiFilters(draft: NcmDraftFilters, defaults: PaginationQuery) {
  const needsClientFetch = hasAnySearchCriteria(draft)

  return {
    filters: {
      ...defaults,
      limit: needsClientFetch
        ? NCM_CLIENT_SEARCH_LIMIT
        : (defaults.limit ?? 50),
      offset: 0,
    },
    usesClientPagination: needsClientFetch,
    clientCriteria: { ncm: draft.ncm, description: draft.description },
  }
}

export function useNcmListFilters() {
  const defaults = defaultNcmFilters()

  const [draftFilters, setDraftFilters] = useState(defaultNcmDraftFilters)
  const [appliedFilters, setAppliedFilters] = useState<PaginationQuery>(defaults)
  const [appliedClientCriteria, setAppliedClientCriteria] =
    useState<NcmDraftFilters>(defaultNcmDraftFilters())
  const [hasSearched, setHasSearched] = useState(false)
  const [isClientPagination, setIsClientPagination] = useState(false)

  const applySearch = useCallback((): boolean => {
    if (!hasAnySearchCriteria(draftFilters)) {
      toast.error("Informe o NCM e/ou a descrição para buscar.")
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
    setDraftFilters(defaultNcmDraftFilters())
    setAppliedFilters(defaultNcmFilters())
    setIsClientPagination(false)
    setAppliedClientCriteria(defaultNcmDraftFilters())
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
