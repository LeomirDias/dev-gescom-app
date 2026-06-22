"use client"

import { useCallback, useState } from "react"

import {
  GROUPS_CLIENT_SEARCH_LIMIT,
  defaultGroupsDraftFilters,
  defaultGroupsFilters,
  type GroupsDraftFilters,
} from "@/app/(app_routes)/products/groups/_components/groups-constants"
import type { PaginationQuery } from "@/modules/products/products-query"

function buildApiFilters(
  draft: GroupsDraftFilters,
  defaults: PaginationQuery
) {
  const description = draft.description.trim()
  const needsClientFetch = description.length > 0

  return {
    filters: {
      ...defaults,
      limit: needsClientFetch
        ? GROUPS_CLIENT_SEARCH_LIMIT
        : (defaults.limit ?? 50),
      offset: 0,
    },
    usesClientPagination: needsClientFetch,
    clientCriteria: { description: draft.description },
  }
}

export function useGroupsListFilters() {
  const defaults = defaultGroupsFilters()

  const [draftFilters, setDraftFilters] = useState(defaultGroupsDraftFilters)
  const [appliedFilters, setAppliedFilters] = useState<PaginationQuery>(defaults)
  const [appliedClientCriteria, setAppliedClientCriteria] =
    useState<GroupsDraftFilters>(defaultGroupsDraftFilters())
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
    setDraftFilters(defaultGroupsDraftFilters())
    setAppliedFilters(defaultGroupsFilters())
    setIsClientPagination(false)
    setAppliedClientCriteria(defaultGroupsDraftFilters())
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
