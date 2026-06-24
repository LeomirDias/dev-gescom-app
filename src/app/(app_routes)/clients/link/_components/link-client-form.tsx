"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SearchForm } from "@/components/global/forms/search-form"
import { ListingSearchResult } from "@/components/global/listing/listing-search-result"
import { TableListing } from "@/components/global/listing/table-listing"
import {
  ListErrorCard,
  useListErrorState,
} from "@/components/global/listing/paginated-list-shell"
import { PageHeader } from "@/components/global/structural/page-header"
import { CLIENT_MEMBER_CLASS } from "@/modules/memberships/memberships-rules"
import { useCreateMemberMutation } from "@/modules/memberships/use-members"
import type { ListUsersQuery } from "@/modules/users/users.schema"
import {
  defaultUsersDraftFilters,
  defaultUsersListFilters,
  filterUsersByName,
  paginateUsers,
  type UsersDraftFilters,
  usersDraftFiltersToQuery,
} from "@/modules/users/users-rules"
import { useUsersQuery } from "@/modules/users/use-users"
import { LinkClientUsersTableRows } from "./link-client-users-table-rows"

const PAGE_SIZE_OPTIONS = [20, 50, 100]

type UserFilterKey = keyof Pick<
  UsersDraftFilters,
  "name" | "registration" | "email" | "phone"
>

const USER_FILTER_FIELDS: Array<{
  id: string
  key: UserFilterKey
  label: string
  placeholder: string
  inputMode?: "text" | "numeric"
  numericOnly?: boolean
}> = [
    {
      id: "name",
      key: "name",
      label: "Nome",
      placeholder: "Informe o nome",
    },
    {
      id: "registration",
      key: "registration",
      label: "CPF/CNPJ",
      placeholder: "Informe o CPF ou CNPJ",
      inputMode: "numeric",
      numericOnly: true,
    },
    {
      id: "email",
      key: "email",
      label: "E-mail",
      placeholder: "Informe o e-mail",
    },
    {
      id: "phone",
      key: "phone",
      label: "Telefone",
      placeholder: "Informe o telefone",
    },
  ]

export function LinkClientForm({
  enterpriseId,
}: {
  enterpriseId: string
}) {
  const router = useRouter()
  const linkMutation = useCreateMemberMutation(enterpriseId)
  const [draftFilters, setDraftFilters] = useState(defaultUsersDraftFilters())
  const [appliedNameFilter, setAppliedNameFilter] = useState("")
  const [appliedQuery, setAppliedQuery] = useState<ListUsersQuery>(
    defaultUsersListFilters()
  )
  const [uiOffset, setUiOffset] = useState(0)
  const [uiLimit, setUiLimit] = useState(50)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [fetchAllPages, setFetchAllPages] = useState(false)

  const { data, error, isPending, isFetching } = useUsersQuery({
    enterpriseId,
    filters: appliedQuery,
    enabled: hasSearched,
    fetchAllPages,
  })

  const listItems = data?.items
  const filteredItems = useMemo(() => {
    if (!listItems) return []
    return filterUsersByName(listItems, appliedNameFilter)
  }, [listItems, appliedNameFilter])

  const displayedItems = useMemo(
    () => paginateUsers(filteredItems, uiOffset, uiLimit),
    [filteredItems, uiOffset, uiLimit]
  )

  const rangeStart = filteredItems.length === 0 ? 0 : uiOffset + 1
  const rangeEnd = Math.min(uiOffset + uiLimit, filteredItems.length)

  const applySearch = useCallback(() => {
    const {
      query,
      error: validationError,
      searchByName,
    } = usersDraftFiltersToQuery(draftFilters)
    if (validationError) {
      toast.error(validationError)
      return
    }

    setAppliedNameFilter(searchByName ?? "")
    setAppliedQuery(query)
    setFetchAllPages(Boolean(searchByName))
    setUiOffset(0)
    setSelectedUserId(null)
    setHasSearched(true)
  }, [draftFilters])

  const clearSearch = useCallback(() => {
    setDraftFilters(defaultUsersDraftFilters())
    setAppliedNameFilter("")
    setAppliedQuery(defaultUsersListFilters())
    setUiOffset(0)
    setSelectedUserId(null)
    setHasSearched(false)
    setFetchAllPages(false)
  }, [])

  const handleLimitChange = useCallback((limit: number) => {
    setUiLimit(limit)
    setUiOffset(0)
  }, [])

  const searchFields = useMemo(
    () =>
      USER_FILTER_FIELDS.map(
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
    [draftFilters]
  )

  async function handleLink() {
    if (!selectedUserId) {
      toast.error("Selecione um usuário na lista.")
      return
    }

    try {
      const member = await linkMutation.mutateAsync({
        userId: selectedUserId,
        class: CLIENT_MEMBER_CLASS,
        departments: [],
      })
      router.push(`/clients/${member.id}`)
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  const { errMessage, errMeta } = useListErrorState(
    error,
    "Erro ao carregar lista de usuários"
  )

  const isSearching = hasSearched && (isFetching || isPending)

  return (
    <Card className="bg-background border-none ring-0">
      <CardHeader>
        <PageHeader title="Vincular cliente" subtitle="Vincule usuário como cliente." />
      </CardHeader>
      <CardContent className="space-y-6">
        <SearchForm
          title="Buscar usuário"
          idPrefix="link-client-form"
          fields={searchFields}
          onSearch={applySearch}
          isSearching={isSearching}
          hasSearched={hasSearched}
          appliedValues={{
            name: appliedNameFilter,
            registration: appliedQuery.registration,
            email: appliedQuery.email,
            phone: appliedQuery.phone,
          }}
          searchLabel="Buscar"
          searchTooltip="Buscar"
          loadingLabel="Carregando lista de usuários..."
          footer={
            hasSearched ? (
              <Button
                type="button"
                variant="outline"
                disabled={isSearching}
                onClick={clearSearch}
              >
                Limpar
              </Button>
            ) : null
          }
        />

        {hasSearched && selectedUserId && (
          <div className="flex justify-end w-full">
            <Button
              type="button"
              disabled={linkMutation.isPending || !selectedUserId}
              onClick={() => void handleLink()}
              className="w-full sm:w-auto"
            >
              {linkMutation.isPending
                ? "Vinculando cliente..."
                : "Vincular cliente"}
            </Button>
          </div>
        )}


        <ListingSearchResult
          hasSearched={hasSearched}
          isSearching={isSearching}
          error={hasSearched && error && !data ? error : null}
          idleTitle="Nenhum usuário encontrado"
          idleHint="Busque por um usuário para vincular a um cliente"
          searchingTitle="A carregar lista de usuários..."
          errorDetails={
            <ListErrorCard
              title="Erro ao carregar lista de usuários"
              message={errMessage}
              meta={errMeta}
            />
          }
          total={filteredItems.length}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
        >
          <TableListing
            items={displayedItems}
            total={filteredItems.length}
            limit={uiLimit}
            offset={uiOffset}
            emptyTitle="Nenhum usuário encontrado"
            emptyHint={
              appliedNameFilter.trim()
                ? "Busque por um usuário para vincular a um cliente"
                : "Ajuste os filtros ou pesquise no catálogo global de usuários."
            }
            onPageChange={setUiOffset}
            onLimitChange={handleLimitChange}
            onClearFilters={clearSearch}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
          >

            <LinkClientUsersTableRows
              items={displayedItems}
              selectedUserId={selectedUserId}
              onSelectUser={setSelectedUserId}
            />

          </TableListing>
        </ListingSearchResult>

        {hasSearched && isFetching && !isPending && (
          <p className="text-xs text-muted-foreground">Atualizando lista de usuários...</p>
        )}

      </CardContent>
    </Card>
  )
}
