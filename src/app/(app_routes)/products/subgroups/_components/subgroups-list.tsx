"use client"

import { useCallback, useMemo } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { getProductResourceConfig } from "@/app/(app_routes)/products/catalogs/_components/product-resource-config"
import { SUBGROUPS_LABELS } from "@/app/(app_routes)/products/subgroups/_components/subgroups-constants"
import { filterProductSubgroups } from "@/app/(app_routes)/products/subgroups/_components/subgroups-client-filters"
import { SubgroupsTableRows } from "@/app/(app_routes)/products/subgroups/_components/subgroups-table-rows"
import { useSubgroupsListFilters } from "@/app/(app_routes)/products/subgroups/_components/use-subgroups-list-filters"
import {
  ListErrorCard,
  PaginatedListLayout,
  StaleDataBanner,
  useListErrorState,
} from "@/components/global/listing/paginated-list-shell"
import {
  EnterprisePermissionGuard,
  useEnterprisePermissionAccess,
} from "@/components/global/guards/enterprise-permission-guard"
import { SearchForm } from "@/components/global/forms/search-form"
import { ListingSearchResult } from "@/components/global/listing/listing-search-result"
import { TableListing } from "@/components/global/listing/table-listing"
import { PageHeader } from "@/components/global/structural/page-header"
import { PERMISSION_CODES } from "@/lib/permissions"
import { useProductSubgroupsQuery } from "@/modules/products/use-products"

const config = getProductResourceConfig("subgroups")!

export function SubgroupsList() {
  const { ready, perms } = useEnterprisePermissionAccess()

  const {
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
  } = useSubgroupsListFilters()

  const queryFilters = useMemo(
    () =>
      isClientPagination
        ? { ...appliedFilters, offset: 0 }
        : appliedFilters,
    [appliedFilters, isClientPagination]
  )

  const { data, error, isPending, isFetching, refetch } =
    useProductSubgroupsQuery({
      filters: queryFilters,
      enabled: ready && perms.canConsultProductSubgroups && hasSearched,
    })

  const filteredItems = useMemo(() => {
    if (!data) return []
    return filterProductSubgroups(data.items, appliedClientCriteria)
  }, [data, appliedClientCriteria])

  const listing = useMemo(() => {
    const limit = appliedFilters.limit ?? data?.limit ?? 50
    const offset = isClientPagination
      ? (appliedFilters.offset ?? 0)
      : (data?.offset ?? 0)
    const total = isClientPagination
      ? filteredItems.length
      : (data?.total ?? 0)
    const items = isClientPagination
      ? filteredItems.slice(offset, offset + limit)
      : filteredItems

    return {
      items,
      total,
      limit,
      offset,
      rangeStart: total === 0 ? 0 : offset + 1,
      rangeEnd: Math.min(offset + limit, total),
    }
  }, [
    appliedFilters.limit,
    appliedFilters.offset,
    data?.limit,
    data?.offset,
    data?.total,
    filteredItems,
    isClientPagination,
  ])

  const searchFields = useMemo(
    () => [
      {
        id: "description",
        label: "Descrição",
        value: draftFilters.description,
        onChange: (value: string) =>
          setDraftFilters((prev) => ({ ...prev, description: value })),
        placeholder: "Informe a descrição do subgrupo",
        ariaLabel: "Descrição do subgrupo",
      },
    ],
    [draftFilters.description, setDraftFilters]
  )

  function handleSearch() {
    applySearch()
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
      perms.canConsultProductSubgroups &&
      hasSearched,
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    SUBGROUPS_LABELS.loadListError
  )

  const isSearching = hasSearched && (isFetching || isPending)
  const showStaleBanner = hasSearched && Boolean(error) && Boolean(data)

  return (
    <EnterprisePermissionGuard
      check={(p) => p.canConsultProductSubgroups}
      permissionLabel={PERMISSION_CODES.consultarSubgruposProduto}
    >
      <PaginatedListLayout>
        <PageHeader title={config.title} subtitle={config.description} />

        <SearchForm
          title="Buscar subgrupo"
          idPrefix="subgroups-filter"
          fields={searchFields}
          onSearch={handleSearch}
          isSearching={isSearching}
          searchLabel="Buscar subgrupos"
          searchTooltip="Buscar subgrupos de produto"
          loadingLabel="Carregando subgrupos..."
        />

        {showStaleBanner && <StaleDataBanner message={errMessage} />}

        <ListingSearchResult
          hasSearched={hasSearched}
          isSearching={isSearching}
          error={hasSearched && error && !data ? error : null}
          idleTitle="Nenhuma busca realizada"
          idleHint="Clique em Buscar subgrupos para listar os registros ou refine pela descrição"
          searchingTitle="Buscando subgrupos..."
          errorDetails={
            <ListErrorCard
              title={SUBGROUPS_LABELS.loadListErrorTitle}
              message={errMessage}
              meta={errMeta}
            />
          }
          total={listing.total}
          rangeStart={listing.rangeStart}
          rangeEnd={listing.rangeEnd}
        >
          <TableListing
            items={listing.items}
            total={listing.total}
            limit={listing.limit}
            offset={listing.offset}
            emptyTitle={SUBGROUPS_LABELS.emptyList}
            emptyHint={SUBGROUPS_LABELS.emptyListHint}
            onPageChange={setPageOffset}
            onLimitChange={setLimit}
            onClearFilters={clearFilters}
          >
            <SubgroupsTableRows
              items={listing.items}
              pluralLabel={SUBGROUPS_LABELS.plural}
            />
          </TableListing>
        </ListingSearchResult>
      </PaginatedListLayout>
    </EnterprisePermissionGuard>
  )
}
