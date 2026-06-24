"use client"

import { Send, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"

type MembersListActionsProps = {
  canCreate: boolean
  canInvite: boolean
  onCreate: () => void
  onInvite: () => void
}

export function MembersListActions({
  canCreate,
  canInvite,
  onCreate,
  onInvite,
}: MembersListActionsProps) {
  return (
    <>
      {canCreate && (
        <Button type="button" onClick={onCreate}>
          <UserPlus className="size-4" aria-hidden />
          Adicionar membro
        </Button>
      )}
      {canInvite && (
        <Button type="button" variant="outline" onClick={onInvite}>
          <Send className="size-4" aria-hidden />
          Convidar membro
        </Button>
      )}
    </>
  )
}
