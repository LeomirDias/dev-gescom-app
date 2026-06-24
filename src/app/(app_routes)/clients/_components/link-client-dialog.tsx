"use client"

import { LinkClientForm } from "@/app/(app_routes)/clients/_components/link-client-form"
import { MemberFormSheet } from "@/app/(app_routes)/members/_components/member-form-sheet"

type LinkClientDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterpriseId: string
  onSuccess?: (clientId: string) => void
}

export function LinkClientDialog({
  open,
  onOpenChange,
  enterpriseId,
  onSuccess,
}: LinkClientDialogProps) {
  return (
    <MemberFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Vincular cliente"
      description="Busque e vincule um usuário existente como cliente"
    >
      <LinkClientForm enterpriseId={enterpriseId} onSuccess={onSuccess} />
    </MemberFormSheet>
  )
}
