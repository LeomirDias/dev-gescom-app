"use client"

import { useCallback, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { HttpError } from "@/lib/api/http-error"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import { CLIENT_MEMBER_CLASS } from "@/modules/memberships/memberships-rules"
import { parseMembershipSearchTerm } from "@/modules/memberships/memberships-rules"
import { MembersFilters } from "@/app/(app_routes)/members/_components/members-filters"
import { LinkClientUsersTable } from "@/app/(app_routes)/clients/_components/link-client-users-table"
import { useCreateMemberMutation } from "@/modules/memberships/use-members"
import type { ListUsersQuery } from "@/modules/users/users.schema"
import {
  defaultUsersListFilters,
  filterUsersByName,
  getNameFromParsedSearch,
  paginateUsers,
  searchTermToUsersQuery,
  USERS_UI_PAGE_SIZE,
} from "@/modules/users/users-rules"
import { useUsersQuery } from "@/modules/users/use-users"
import { Spinner } from "@/components/ui/spinner"
import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"

export function LinkClientForm({ enterpriseId }: { enterpriseId: string }) {
  const router = useRouter()
  const linkMutation = useCreateMemberMutation(enterpriseId)
  const [searchTerm, setSearchTerm] = useState("")
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("")
  const [appliedQuery, setAppliedQuery] = useState<ListUsersQuery>(
    defaultUsersListFilters
  )
  const [uiOffset, setUiOffset] = useState(0)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [searchEnabled, setSearchEnabled] = useState(false)

  const { data, error, isPending, isFetching } = useUsersQuery({
    enterpriseId,
    filters: appliedQuery,
    enabled: searchEnabled,
  })

  const appliedParsed = useMemo(
    () => parseMembershipSearchTerm(appliedSearchTerm),
    [appliedSearchTerm]
  )
  const appliedNameFilter = getNameFromParsedSearch(appliedParsed)

  const listItems = data?.items
  const filteredItems = useMemo(() => {
    if (!listItems) return []
    return filterUsersByName(listItems, appliedNameFilter)
  }, [listItems, appliedNameFilter])

  const displayedItems = useMemo(
    () => paginateUsers(filteredItems, uiOffset),
    [filteredItems, uiOffset]
  )

  const applySearch = useCallback(() => {
    const { query, error: validationError } = searchTermToUsersQuery(searchTerm)
    if (validationError) {
      toast.error(validationError)
      return
    }

    setAppliedSearchTerm(searchTerm)
    setAppliedQuery(query)
    setUiOffset(0)
    setSelectedUserId(null)
    setSearchEnabled(true)
  }, [searchTerm])

  const clearSearch = useCallback(() => {
    setSearchTerm("")
    setAppliedSearchTerm("")
    setAppliedQuery(defaultUsersListFilters())
    setUiOffset(0)
    setSelectedUserId(null)
    setSearchEnabled(false)
  }, [])

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
      router.push(`/members/${member.id}`)
    } catch (err) {
      if (err instanceof HttpError) {
        toastHttpError(err, "Não foi possível vincular o cliente.")
        return
      }
      toast.error("Não foi possível vincular o cliente.")
    }
  }

  const listError =
    error instanceof HttpError
      ? error.message
      : error instanceof Error
        ? error.message
        : null

  const emptyFilters: ListMembersQuery = {}

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vincular cliente</CardTitle>
        <CardDescription>
          Vincule um usuário existente à empresa como cliente.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Clientes não possuem departamentos associados nem recebem convites.
        </p>

        <MembersFilters
          filters={emptyFilters}
          onFiltersChange={() => {}}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSearch={applySearch}
          onApplyFilters={() => {}}
          onClear={clearSearch}
          isSearching={isFetching}
          showClassFilter={false}
          showStatusFilter={false}
        />

        {!searchEnabled && (
          <p className="text-center text-sm text-primary">
            Informe o termo completo e clique em <strong>Buscar</strong> para
            localizar o usuário.
          </p>
        )}

        {searchEnabled && isPending && <Spinner className="mx-auto" />}

        {searchEnabled && listError && !data && !isPending && (
          <p className="text-center text-sm text-destructive">{listError}</p>
        )}

        {searchEnabled && data && !isPending && (
          <LinkClientUsersTable
            items={displayedItems}
            total={filteredItems.length}
            limit={USERS_UI_PAGE_SIZE}
            offset={uiOffset}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
            onPageChange={setUiOffset}
            nameFilterActive={Boolean(appliedNameFilter.trim())}
          />
        )}

        {searchEnabled && isFetching && !isPending && (
          <p className="text-xs text-muted-foreground">Atualizando lista...</p>
        )}

        {searchEnabled && (
          <Button
            type="button"
            disabled={linkMutation.isPending || !selectedUserId}
            onClick={() => void handleLink()}
            className="w-full sm:w-auto"
            tooltip="Vincular como cliente"
          >
            {linkMutation.isPending ? "Vinculando..." : "Vincular cliente"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
