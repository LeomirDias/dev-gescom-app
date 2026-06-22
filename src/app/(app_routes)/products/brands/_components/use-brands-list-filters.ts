"use client"

import { useCallback, useState } from "react"

import {
  BRANDS_CLIENT_SEARCH_LIMIT,
  defaultBrandsDraftFilters,
  defaultBrandsFilters,
  type BrandsDraftFilters,
} from "@/app/(app_routes)/products/brands/_components/brands-constants"
import type { PaginationQuery } from "@/modules/products/products-query"

function buildApiFilters(
  draft: BrandsDraftFilters,
  defaults: PaginationQuery
) {
  const description = draft.description.trim()
  const needsClientFetch = description.length > 0

  return {
    filters: {
      ...defaults,
      limit: needsClientFetch
        ? BRANDS_CLIENT_SEARCH_LIMIT
        : (defaults.limit ?? 50),
      offset: 0,
    },
    usesClientPagination: needsClientFetch,
    clientCriteria: { description: draft.description },
  }
}

export function useBrandsListFilters() {
  const defaults = defaultBrandsFilters()

  const [draftFilters, setDraftFilters] = useState(defaultBrandsDraftFilters)
  const [appliedFilters, setAppliedFilters] = useState<PaginationQuery>(defaults)
  const [appliedClientCriteria, setAppliedClientCriteria] =
    useState<BrandsDraftFilters>(defaultBrandsDraftFilters())
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
    setDraftFilters(defaultBrandsDraftFilters())
    setAppliedFilters(defaultBrandsFilters())
    setIsClientPagination(false)
    setAppliedClientCriteria(defaultBrandsDraftFilters())
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
