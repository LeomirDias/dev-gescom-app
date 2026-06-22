"use client"

import { useCallback, useState } from "react"

import {
  DEFAULT_CATALOG_FILTERS,
  DEFAULT_NBS_FILTERS,
  type CatalogConfig,
} from "@/app/(app_routes)/products/catalogs/_components/catalog-config"
import type { PaginationQuery } from "@/modules/products/products-query"
import type { ListProductNbsQuery } from "@/modules/products/products-catalogs.schema"

export function useCatalogListFilters(config: CatalogConfig) {
  const initialFilters = config.supportsSearch
    ? DEFAULT_NBS_FILTERS
    : DEFAULT_CATALOG_FILTERS

  const [draftSearch, setDraftSearch] = useState("")
  const [appliedFilters, setAppliedFilters] = useState<
    PaginationQuery | ListProductNbsQuery
  >(initialFilters)

  const applySearch = useCallback((): boolean => {
    if (!config.supportsSearch) return true

    const search = draftSearch.trim()
    setAppliedFilters({
      ...initialFilters,
      offset: 0,
      search: search.length > 0 ? search : undefined,
    })
    return true
  }, [config.supportsSearch, draftSearch, initialFilters])

  const clearFilters = useCallback(() => {
    setDraftSearch("")
    setAppliedFilters(initialFilters)
  }, [initialFilters])

  const setPageOffset = useCallback((offset: number) => {
    setAppliedFilters((filters) => ({ ...filters, offset }))
  }, [])

  const setLimit = useCallback((limit: number) => {
    setAppliedFilters((filters) => ({ ...filters, limit, offset: 0 }))
  }, [])

  return {
    draftSearch,
    setDraftSearch,
    appliedFilters,
    applySearch,
    clearFilters,
    setPageOffset,
    setLimit,
  }
}
