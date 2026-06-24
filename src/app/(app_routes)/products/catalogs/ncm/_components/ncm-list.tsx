"use client"

import { useCallback, useMemo } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { getCatalogConfig } from "@/app/(app_routes)/products/catalogs/_components/catalog-config"
import { CatalogTableRows } from "@/app/(app_routes)/products/catalogs/_components/catalog-table-rows"
import { filterProductNcm } from "@/app/(app_routes)/products/catalogs/ncm/_components/ncm-client-filters"
import { NCM_LABELS } from "@/app/(app_routes)/products/catalogs/ncm/_components/ncm-constants"
import { useNcmListFilters } from "@/app/(app_routes)/products/catalogs/ncm/_components/use-ncm-list-filters"
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
import { useProductsNcmQuery } from "@/modules/products/use-products"

const config = getCatalogConfig("ncm")!

export function NcmList() {
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
  } = useNcmListFilters()

  const queryFilters = useMemo(
    () =>
      isClientPagination
        ? { ...appliedFilters, offset: 0 }
        : appliedFilters,
    [appliedFilters, isClientPagination]
  )

  const { data, error, isPending, isFetching, refetch } = useProductsNcmQuery({
    filters: queryFilters,
    enabled: ready && perms.canConsultNcm && hasSearched,
  })

  const filteredItems = useMemo(() => {
    if (!data) return []
    return filterProductNcm(data.items, appliedClientCriteria)
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
        id: "ncm",
        label: "NCM",
        value: draftFilters.ncm,
        onChange: (value: string) =>
          setDraftFilters((prev) => ({ ...prev, ncm: value })),
        placeholder: "Informe o código NCM",
        ariaLabel: "Código NCM",
      },
      {
        id: "description",
        label: "Descrição",
        value: draftFilters.description,
        onChange: (value: string) =>
          setDraftFilters((prev) => ({ ...prev, description: value })),
        placeholder: "Informe a descrição do NCM",
        ariaLabel: "Descrição do NCM",
      },
    ],
    [draftFilters.description, draftFilters.ncm, setDraftFilters]
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
      perms.canConsultNcm &&
      hasSearched,
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    NCM_LABELS.loadListError
  )

  const isSearching = hasSearched && (isFetching || isPending)
  const showStaleBanner = hasSearched && Boolean(error) && Boolean(data)

  return (
    <EnterprisePermissionGuard
      check={(p) => p.canConsultNcm}
      permissionLabel={PERMISSION_CODES.consultarNcmProdutos}
    >
      <PaginatedListLayout>
        <PageHeader title={config.title} subtitle={config.description} />

        <SearchForm
          title="Buscar NCM"
          idPrefix="ncm-filter"
          fields={searchFields}
          onSearch={handleSearch}
          isSearching={isSearching}
          hasSearched={hasSearched}
          appliedValues={{
            ncm: appliedClientCriteria.ncm,
            description: appliedClientCriteria.description,
          }}
          searchLabel="Buscar NCM"
          searchTooltip="Buscar códigos NCM"
          loadingLabel="Carregando NCM..."
        />

        {showStaleBanner && <StaleDataBanner message={errMessage} />}

        <ListingSearchResult
          hasSearched={hasSearched}
          isSearching={isSearching}
          error={hasSearched && error && !data ? error : null}
          idleTitle="Nenhuma busca realizada"
          idleHint="Informe o NCM e/ou a descrição e clique em Buscar NCM para listar os registros"
          searchingTitle="Buscando NCM..."
          errorDetails={
            <ListErrorCard
              title={NCM_LABELS.loadListErrorTitle}
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
            emptyTitle={NCM_LABELS.emptyList}
            emptyHint={NCM_LABELS.emptyListHint}
            onPageChange={setPageOffset}
            onLimitChange={setLimit}
            onClearFilters={clearFilters}
          >
            <CatalogTableRows
              items={listing.items}
              columns={[
                { header: "NCM", cell: (item) => item.ncm },
                { header: "Descrição", cell: (item) => item.description },
              ]}
              listLabel="Lista de NCM"
              mobileTitle={(item) => item.description}
              mobileSubtitle={(item) => item.ncm}
            />
          </TableListing>
        </ListingSearchResult>
      </PaginatedListLayout>
    </EnterprisePermissionGuard>
  )
}
