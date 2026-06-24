"use client"

import { CreateMemberForm } from "@/app/(app_routes)/members/_components/create-member-form"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type CreateMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  enterpriseId: string
  onSuccess?: (memberId: string) => void
}

export function CreateMemberDialog({
  open,
  onOpenChange,
  enterpriseId,
  onSuccess,
}: CreateMemberDialogProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col gap-0 p-0 sm:max-w-lg"
      >
        <SheetHeader className="shrink-0 border-b px-6 py-4 pr-12 text-left">
          <SheetTitle className="text-lg">Novo membro</SheetTitle>
          <SheetDescription>
            Crie um novo membro com um novo usuário
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          {open ? (
            <CreateMemberForm
              enterpriseId={enterpriseId}
              onSuccess={onSuccess}
            />
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
