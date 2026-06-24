"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useRegisterPageRefresh } from "@/app/(app_routes)/_components/page-refresh"
import {
  CLIENT_FILTER_FIELDS,
  CLIENTS_IDLE_HINT,
  CLIENTS_IDLE_TITLE,
  CLIENTS_LIST_SUBTITLE,
  CLIENTS_LIST_TITLE,
  CLIENTS_SEARCHING_TITLE,
} from "@/app/(app_routes)/clients/_components/clients-constants"
import { ClientsListActions } from "@/app/(app_routes)/clients/_components/clients-list-actions"
import { ClientsTableRows } from "@/app/(app_routes)/clients/_components/clients-table-rows"
import { SearchForm } from "@/components/global/forms/search-form"
import {
  EnterprisePermissionGuard,
  useEnterprisePermissionAccess,
} from "@/components/global/guards/enterprise-permission-guard"
import { ListingSearchResult } from "@/components/global/listing/listing-search-result"
import {
  ListErrorCard,
  PaginatedListLayout,
  StaleDataBanner,
  useListErrorState,
} from "@/components/global/listing/paginated-list-shell"
import { TableListing } from "@/components/global/listing/table-listing"
import { PageHeader } from "@/components/global/structural/page-header"
import { PERMISSION_CODES } from "@/lib/permissions"
import {
  CLIENT_MEMBER_CLASS,
  filterMembersByName,
} from "@/modules/memberships/memberships-rules"
import { useMembersListFilters } from "@/modules/memberships/use-members-list-filters"
import { useMembersQuery } from "@/modules/memberships/use-members"
import { ClientDetailDialog } from "./client-detail-dialog"
import { LinkClientDialog } from "./link-client-dialog"
import { CreateClientDialog } from "./create-client-dialog"

const DEFAULT_CLIENT_LIST_FILTERS = {
  class: CLIENT_MEMBER_CLASS,
  userId: undefined,
  offset: 0,
  limit: 50,
} as const

export function ClientsList() {
  const { ready, enterpriseId, perms } = useEnterprisePermissionAccess()
  const isExplicitSearch = useRef(false)
  const [viewClientId, setViewClientId] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)

  const {
    draftFilters,
    setDraftFilters,
    appliedFilters,
    clientNameFilter,
    hasSearched,
    isClientPagination,
    applySearch,
    handleSearchResult,
    clearFilters,
    setPageOffset,
    setLimit,
  } = useMembersListFilters({
    defaultListFilters: DEFAULT_CLIENT_LIST_FILTERS,
    singleResultPath: "/clients",
  })

  const { data, error, isPending, isFetching, refetch } = useMembersQuery({
    enterpriseId,
    filters: appliedFilters,
    enabled:
      ready &&
      perms.isReady &&
      !perms.isError &&
      perms.canConsultMembers &&
      hasSearched,
  })

  const filteredItems = useMemo(() => {
    if (!data) return []
    if (!clientNameFilter) return data.items
    return filterMembersByName(data.items, clientNameFilter)
  }, [data, clientNameFilter])

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
    () =>
      CLIENT_FILTER_FIELDS.map(
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
  }, [hasSearched, refetch])

  useRegisterPageRefresh({
    onRefresh: handleRefresh,
    isFetching,
    enabled:
      ready &&
      perms.isReady &&
      !perms.isError &&
      perms.canConsultMembers &&
      hasSearched,
  })

  const { errMessage, errMeta } = useListErrorState(
    error,
    "Não foi possível carregar os clientes."
  )

  const isSearching = hasSearched && (isFetching || isPending)
  const showStaleBanner = hasSearched && Boolean(error) && Boolean(data)

  function handleClientFormSuccess(clientId: string) {
    setCreateOpen(false)
    setLinkOpen(false)
    if (hasSearched) void refetch()
    setViewClientId(clientId)
  }

  return (
    <EnterprisePermissionGuard
      check={(p) => p.canConsultMembers}
      permissionLabel={PERMISSION_CODES.consultarMembros}
    >
      <PaginatedListLayout>
        <PageHeader
          title={CLIENTS_LIST_TITLE}
          subtitle={CLIENTS_LIST_SUBTITLE}
          actions={
            <ClientsListActions
              canCreate={perms.canCreateMemberWithUser}
              canLink={perms.canCreateMemberWithUser}
              onCreate={() => setCreateOpen(true)}
              onLink={() => setLinkOpen(true)}
            />
          }
        />

        <SearchForm
          title="Buscar clientes"
          idPrefix="clients-filters-form"
          fields={searchFields}
          onSearch={handleSearch}
          isSearching={isSearching}
          hasSearched={hasSearched}
          appliedValues={{
            code:
              appliedFilters.code != null ? String(appliedFilters.code) : "",
            name: clientNameFilter,
            registration: appliedFilters.registration,
            email: appliedFilters.email,
            phone: appliedFilters.phone,
          }}
          searchLabel="Buscar clientes"
          searchTooltip="Buscar clientes"
          loadingLabel={CLIENTS_SEARCHING_TITLE}
        />

        {showStaleBanner && <StaleDataBanner message={errMessage} />}

        <ListingSearchResult
          hasSearched={hasSearched}
          isSearching={isSearching}
          error={hasSearched && error && !data ? error : null}
          idleTitle={CLIENTS_IDLE_TITLE}
          idleHint={CLIENTS_IDLE_HINT}
          searchingTitle={CLIENTS_SEARCHING_TITLE}
          errorDetails={
            <ListErrorCard
              title="Erro ao carregar os clientes"
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
            emptyTitle="Nenhum cliente encontrado"
            emptyHint="Ajuste os filtros ou adicione um novo cliente."
            onPageChange={setPageOffset}
            onLimitChange={setLimit}
            onClearFilters={clearFilters}
          >
            <ClientsTableRows
              items={listing.items}
              onView={setViewClientId}
            />
          </TableListing>
        </ListingSearchResult>
      </PaginatedListLayout>

      {enterpriseId && (
        <>
          <CreateClientDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            enterpriseId={enterpriseId}
            onSuccess={handleClientFormSuccess}
          />
          <LinkClientDialog
            open={linkOpen}
            onOpenChange={setLinkOpen}
            enterpriseId={enterpriseId}
            onSuccess={handleClientFormSuccess}
          />
        </>
      )}

      {viewClientId && (
        <ClientDetailDialog
          clientId={viewClientId}
          open
          onOpenChange={(open) => {
            if (!open) setViewClientId(null)
          }}
        />
      )}
    </EnterprisePermissionGuard>
  )
}
