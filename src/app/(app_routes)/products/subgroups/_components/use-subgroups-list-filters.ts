"use client"

import { useCallback, useState } from "react"

import {
  SUBGROUPS_CLIENT_SEARCH_LIMIT,
  defaultSubgroupsDraftFilters,
  defaultSubgroupsFilters,
  type SubgroupsDraftFilters,
} from "@/app/(app_routes)/products/subgroups/_components/subgroups-constants"
import type { PaginationQuery } from "@/modules/products/products-query"

function buildApiFilters(
  draft: SubgroupsDraftFilters,
  defaults: PaginationQuery
) {
  const description = draft.description.trim()
  const needsClientFetch = description.length > 0

  return {
    filters: {
      ...defaults,
      limit: needsClientFetch
        ? SUBGROUPS_CLIENT_SEARCH_LIMIT
        : (defaults.limit ?? 50),
      offset: 0,
    },
    usesClientPagination: needsClientFetch,
    clientCriteria: { description: draft.description },
  }
}

export function useSubgroupsListFilters() {
  const defaults = defaultSubgroupsFilters()

  const [draftFilters, setDraftFilters] = useState(defaultSubgroupsDraftFilters)
  const [appliedFilters, setAppliedFilters] = useState<PaginationQuery>(defaults)
  const [appliedClientCriteria, setAppliedClientCriteria] =
    useState<SubgroupsDraftFilters>(defaultSubgroupsDraftFilters())
  const [hasSearched, setHasSearched] = useState(false)
  const [isClientPagination, setIsClientPagination] = useState(false)

  const applySearch = useCallback((): boolean => {
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
    setDraftFilters(defaultSubgroupsDraftFilters())
    setAppliedFilters(defaultSubgroupsFilters())
    setIsClientPagination(false)
    setAppliedClientCriteria(defaultSubgroupsDraftFilters())
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
