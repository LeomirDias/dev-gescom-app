"use client"

import { InviteMemberForm } from "@/app/(app_routes)/members/_components/invite-member-form"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type InviteMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterpriseId: string
  onSuccess?: (memberId: string) => void
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  enterpriseId,
  onSuccess,
}: InviteMemberDialogProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-lg"
      >
        <SheetHeader className="shrink-0 border-b px-6 py-4 pr-12 text-left">
          <SheetTitle className="text-lg">Convite de membro</SheetTitle>
          <SheetDescription>
            Envie um convite para um novo membro
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          {open ? (
            <InviteMemberForm
              enterpriseId={enterpriseId}
              onSuccess={onSuccess}
            />
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
