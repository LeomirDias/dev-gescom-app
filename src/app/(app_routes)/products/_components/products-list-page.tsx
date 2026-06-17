"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { ProductsFilters } from "@/components/global/search/search-form"
import { ProductsListHeader } from "@/app/(app_routes)/products/_components/products-list-header"
import { ProductsSearchResults } from "@/app/(app_routes)/products/_components/products-search-results"
import { ProductsContentLoading } from "@/app/(app_routes)/products/_components/products-route-loading"
import {
  PaginatedListLayout,
  PermissionDeniedCard,
  PermissionsErrorCard,
  StaleDataBanner,
  useListErrorState,
} from "@/app/(app_routes)/products/_components/paginated-list-shell"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import { filterProductEnterprises } from "@/modules/products/products-client-filters"
import type { ProductsListRouteConfig } from "@/modules/products/products-route-config"
import { useProductsListFilters } from "@/modules/products/use-products-list-filters"
import { useProductsEnterprisesQuery } from "@/modules/products/use-products"

type ProductsListPageProps = {
  config: ProductsListRouteConfig
}

export function ProductsListPage({ config }: ProductsListPageProps) {
  const { ready } = useRequireEnterprise()
  const perms = useOperatorPermissions()
  const isExplicitSearch = useRef(false)

  const {
    draftFilters,
    setDraftFilters,
    draftDateFilters,
    setDraftDateFilters,
    appliedFilters,
    appliedClientCriteria,
    activeFilterCount,
    hasSearched,
    isClientPagination,
    applySearch,
    handleSearchResult,
    clearFilters,
    setPageOffset,
    setLimit,
  } = useProductsListFilters(config)

  const queryFilters = useMemo(() => {
    if (!isClientPagination) return appliedFilters
    return { ...appliedFilters, offset: 0 }
  }, [appliedFilters, isClientPagination])

  const { data, error, isPending, isFetching, refetch } =
    useProductsEnterprisesQuery({
      filters: queryFilters,
      enabled: ready && perms.canConsultProducts && hasSearched,
    })

  const filteredItems = useMemo(() => {
    if (!data) return []
    return filterProductEnterprises(data.items, appliedClientCriteria)
  }, [data, appliedClientCriteria])

  const tableItems = useMemo(() => {
    if (!isClientPagination) return filteredItems
    const offset = appliedFilters.offset ?? 0
    const limit = appliedFilters.limit ?? data?.limit ?? 50
    return filteredItems.slice(offset, offset + limit)
  }, [
    filteredItems,
    isClientPagination,
    appliedFilters.offset,
    appliedFilters.limit,
    data?.limit,
  ])

  const tableTotal = isClientPagination
    ? filteredItems.length
    : (data?.total ?? 0)
  const tableOffset = isClientPagination
    ? (appliedFilters.offset ?? 0)
    : (data?.offset ?? 0)
  const tableLimit = appliedFilters.limit ?? data?.limit ?? 50

  const rangeStart = tableTotal === 0 ? 0 : tableOffset + 1
  const rangeEnd = Math.min(tableOffset + tableLimit, tableTotal)

  useEffect(() => {
    if (!isExplicitSearch.current) return
    if (isFetching || isPending) return
    if (!data) return
    isExplicitSearch.current = false
    handleSearchResult(isClientPagination ? filteredItems : data.items)
  }, [
    isFetching,
    isPending,
    data,
    filteredItems,
    isClientPagination,
    handleSearchResult,
  ])

  function handleSearch() {
    const ok = applySearch()
    if (ok) isExplicitSearch.current = true
  }

  const handleRefresh = useCallback(() => {
    if (!hasSearched) return
    void refetch()
  }, [hasSearched, refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled:
      ready &&
      perms.isReady &&
      !perms.isError &&
      perms.canConsultProducts &&
      hasSearched,
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    config.labels.loadListError
  )

  if (!ready || !perms.isReady) {
    return (
      <PaginatedListLayout loading={<ProductsContentLoading />}>
        {null}
      </PaginatedListLayout>
    )
  }

  if (perms.isError) return <PermissionsErrorCard />

  if (!perms.canConsultProducts) {
    return <PermissionDeniedCard permissionLabel="consultar_produtos" />
  }

  const isSearching = hasSearched && (isFetching || isPending)
  const showStaleBanner = hasSearched && Boolean(error) && Boolean(data)

  return (
    <div className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <ProductsListHeader config={config} />
      <ProductsFilters
        draftFilters={draftFilters}
        dateFilters={draftDateFilters}
        activeFilterCount={activeFilterCount}
        onDraftFiltersChange={setDraftFilters}
        onDateFiltersChange={setDraftDateFilters}
        onSearch={handleSearch}
        isSearching={isSearching}
      />
      {showStaleBanner && <StaleDataBanner message={errMessage} />}

      <ProductsSearchResults
        hasSearched={hasSearched}
        isSearching={isSearching}
        error={hasSearched && error && !data ? error : null}
        errorTitle={config.labels.loadListErrorTitle}
        errorMessage={errMessage}
        errorMeta={errMeta}
        items={tableItems}
        total={tableTotal}
        limit={tableLimit}
        offset={tableOffset}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        config={config}
        emptyTitle={config.labels.emptyList}
        emptyHint={config.labels.emptyListHint}
        onPageChange={setPageOffset}
        onLimitChange={setLimit}
        onClearFilters={clearFilters}
        isClientPagination={isClientPagination}
      />
    </div>

  )
}
