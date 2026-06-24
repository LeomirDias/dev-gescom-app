"use client"

import { CreateClientForm } from "@/app/(app_routes)/clients/_components/create-client-form"
import { MemberFormSheet } from "@/app/(app_routes)/members/_components/member-form-sheet"

type CreateClientDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterpriseId: string
  onSuccess?: (clientId: string) => void
}

export function CreateClientDialog({
  open,
  onOpenChange,
  enterpriseId,
  onSuccess,
}: CreateClientDialogProps) {
  return (
    <MemberFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Novo cliente"
      description="Crie um novo cliente com um novo usuário"
    >
      <CreateClientForm enterpriseId={enterpriseId} onSuccess={onSuccess} />
    </MemberFormSheet>
  )
}
