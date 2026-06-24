"use client"

import { Link2, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"

type ClientsListActionsProps = {
  canCreate: boolean
  canLink: boolean
  onCreate: () => void
  onLink: () => void
}

export function ClientsListActions({
  canCreate,
  canLink,
  onCreate,
  onLink,
}: ClientsListActionsProps) {
  return (
    <>
      {canCreate && (
        <Button type="button" onClick={onCreate}>
          <UserPlus className="size-4" aria-hidden />
          Adicionar cliente
        </Button>
      )}
      {canLink && (
        <Button type="button" variant="outline" onClick={onLink}>
          <Link2 className="size-4" aria-hidden />
          Vincular cliente
        </Button>
      )}
    </>
  )
}
