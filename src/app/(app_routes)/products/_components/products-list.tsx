"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import { ProductDetailDialog } from "@/app/(app_routes)/products/_components/product-detail-dialog"
import { ProductsTableRows } from "@/app/(app_routes)/products/_components/products-table-rows"
import type { ProductsDraftFilters } from "@/app/(app_routes)/products/_components/products-constants"
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
import { PERMISSION_CODES } from "@/lib/permissions"
import type { ProductsListRouteConfig } from "@/modules/products/products-route-config"
import { useProductsListFilters } from "@/modules/products/use-products-list-filters"
import { useProductsLocationProductIds } from "@/modules/products/use-products-location-ids"
import { useProductsListDisplayItems } from "@/modules/products/use-products-list-display"
import { useProductsSearchQuery } from "@/modules/products/use-products-search-query"
import { PageHeader } from "@/components/global/structural/page-header"

type ProductsListProps = {
  config: ProductsListRouteConfig
}

type ProductFilterKey = keyof Pick<
  ProductsDraftFilters,
  | "code"
  | "description"
  | "barCode"
  | "manufacturer"
  | "origin"
  | "group"
  | "subgroup"
  | "brand"
  | "application"
  | "locacao"
>

const PRODUCT_FILTER_FIELDS: Array<{
  id: string
  key: ProductFilterKey
  label: string
  placeholder: string
  inputMode?: "text" | "numeric"
  numericOnly?: boolean
}> = [
  {
    id: "code",
    key: "code",
    label: "Código interno",
    placeholder: "Informe o código interno do produto",
  },
  {
    id: "description",
    key: "description",
    label: "Descrição",
    placeholder: "Informe a descrição do produto",
  },
  {
    id: "barcode",
    key: "barCode",
    label: "Código de barras",
    placeholder: "Informe o código de barras do produto",
  },
  {
    id: "manufacturer",
    key: "manufacturer",
    label: "Número do fabricante",
    placeholder: "Informe o número do fabricante do produto",
    inputMode: "numeric",
    numericOnly: true,
  },
  {
    id: "origin",
    key: "origin",
    label: "Número original",
    placeholder: "Informe o número original do produto",
  },
  {
    id: "group",
    key: "group",
    label: "Grupo",
    placeholder: "Informe a descrição do grupo",
  },
  {
    id: "subgroup",
    key: "subgroup",
    label: "Sub-grupo",
    placeholder: "Informe a descrição do sub-grupo",
  },
  {
    id: "brand",
    key: "brand",
    label: "Marca",
    placeholder: "Informe a descrição da marca",
  },
  {
    id: "application",
    key: "application",
    label: "Aplicação",
    placeholder: "Informe a aplicação do produto",
  },
  {
    id: "locacao",
    key: "locacao",
    label: "Locação",
    placeholder: "Informe o código ou descrição da locação",
  },
]

export function ProductsList({ config }: ProductsListProps) {
  const { ready, perms } = useEnterprisePermissionAccess()
  const isExplicitSearch = useRef(false)
  const [viewProductId, setViewProductId] = useState<string | null>(null)

  const {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    appliedClientCriteria,
    hasSearched,
    isClientPagination,
    applySearch,
    handleSearchResult,
    clearFilters,
    setPageOffset,
    setLimit,
  } = useProductsListFilters(config)

  const locacaoTerm = appliedClientCriteria.locacao?.trim()
  const locationFilterActive = Boolean(locacaoTerm)

  const locationQuery = useProductsLocationProductIds({
    locacao: locacaoTerm,
    enabled:
      ready && perms.canConsultProducts && hasSearched && locationFilterActive,
  })

  const locationProductIds =
    locationFilterActive && locationQuery.isSuccess
      ? locationQuery.data?.productIds
      : undefined

  const locationResolved =
    !locationFilterActive ||
    locationQuery.isSuccess ||
    locationQuery.isError

  const { data, error, isPending, isFetching, refetch } = useProductsSearchQuery({
    appliedFilters,
    appliedClientCriteria,
    locationProductIds,
    locationFilterActive,
    locationResolved,
    isClientPagination,
    enabled: ready && perms.canConsultProducts && hasSearched,
  })

  const searchError = error ?? (locationFilterActive ? locationQuery.error : null)

  useEffect(() => {
    if (!hasSearched || !locationFilterActive || !locationQuery.isSuccess) return

    const { matchedLocationCount, productIds } = locationQuery.data
    if (matchedLocationCount === 0) {
      toast.message("Nenhuma locação encontrada para o termo informado.")
      return
    }
    if (productIds.length === 0) {
      toast.message("Nenhum produto vinculado à locação encontrada.")
    }
  }, [hasSearched, locationFilterActive, locationQuery.isSuccess, locationQuery.data])

  const filteredItems = useMemo(() => data?.items ?? [], [data?.items])

  const displayItems = useProductsListDisplayItems({
    items: filteredItems,
    enabled: ready && perms.canConsultProducts && hasSearched,
  })

  const listing = useMemo(() => {
    const limit = appliedFilters.limit ?? data?.limit ?? 50
    const offset = isClientPagination
      ? (appliedFilters.offset ?? 0)
      : (data?.offset ?? 0)
    const total = isClientPagination
      ? displayItems.length
      : (data?.total ?? 0)
    const items = isClientPagination
      ? displayItems.slice(offset, offset + limit)
      : displayItems

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
    displayItems,
    isClientPagination,
  ])

  const searchFields = useMemo(
    () =>
      PRODUCT_FILTER_FIELDS.map(
        ({ id, key, label, placeholder, inputMode, numericOnly }) => ({
          id,
          label,
          value: draftFilters[key],
          onChange: (value: string) => {
            const nextValue = numericOnly ? value.replace(/\D/g, "") : value
            setDraftFilters((prev) => ({ ...prev, [key]: nextValue }))
          },
          placeholder,
          ariaLabel: label,
          inputMode,
        })
      ),
    [draftFilters, setDraftFilters]
  )

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
    if (locationFilterActive) void locationQuery.refetch()
  }, [hasSearched, refetch, locationFilterActive, locationQuery])

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
    searchError,
    config.labels.loadListError
  )

  const isSearching =
    hasSearched &&
    (isFetching || isPending || (locationFilterActive && locationQuery.isPending))
  const showStaleBanner = hasSearched && Boolean(searchError) && Boolean(data)

  return (
    <EnterprisePermissionGuard
      check={(p) => p.canConsultProducts}
      permissionLabel={PERMISSION_CODES.consultarProdutos}
    >
      <PaginatedListLayout>
        <PageHeader title="Produtos" subtitle="Gerencie e consulte os produtos cadastrados" />

        <SearchForm
          title="Buscar produto"
          idPrefix="products-filter"
          fields={searchFields}
          onSearch={handleSearch}
          isSearching={isSearching}
          searchLabel="Buscar produto"
          searchTooltip="Buscar produtos"
          loadingLabel="Carregando produtos..."
        />

        {showStaleBanner && <StaleDataBanner message={errMessage} />}

        <ListingSearchResult
          hasSearched={hasSearched}
          isSearching={isSearching}
          error={hasSearched && searchError && !data ? searchError : null}
          searchingTitle="Buscando produtos..."
          errorDetails={
            <ListErrorCard
              title={config.labels.loadListErrorTitle}
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
            emptyTitle={config.labels.emptyList}
            emptyHint={config.labels.emptyListHint}
            onPageChange={setPageOffset}
            onLimitChange={setLimit}
            onClearFilters={clearFilters}
            footer={
              viewProductId ? (
                <ProductDetailDialog
                  productEnterpriseId={viewProductId}
                  config={config}
                  open
                  onOpenChange={(open) => {
                    if (!open) setViewProductId(null)
                  }}
                />
              ) : null
            }
          >
            <ProductsTableRows
              items={listing.items}
              pluralLabel={config.labels.plural}
              onView={setViewProductId}
            />
          </TableListing>
        </ListingSearchResult>
      </PaginatedListLayout>
    </EnterprisePermissionGuard>
  )
}
