"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"

import { MemberDetailView } from "@/app/(app_routes)/members/_components/member-detail-view"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { HttpError } from "@/lib/api/http-error"
import { useOperatorPermissions } from "@/lib/permissions"
import { useMemberQuery } from "@/modules/memberships/use-members"
import { Button } from "@/components/ui/button"
import { AnimatedLoading } from "@/components/global/loading/animated-loading"

type MemberDetailDialogProps = {
  memberId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MemberDetailDialog({
  memberId,
  open,
  onOpenChange,
}: MemberDetailDialogProps) {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const { data, error, isPending } = useMemberQuery({
    enterpriseId,
    memberId,
    enabled: open && ready && perms.canConsultMembers && Boolean(memberId),
  })

  const errMessage =
    error instanceof HttpError
      ? error.message
      : error instanceof Error
        ? error.message
        : "Não foi possível carregar o membro."

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-auto flex-col gap-0 p-0"
      >

        <SheetHeader className="w-full border-b p-4 hidden">
          <SheetTitle className="text-lg">Membro</SheetTitle>
          <SheetDescription>Visualização rápida do membro</SheetDescription>
        </SheetHeader>

        <div className="w-full h-full flex-1 overflow-y-auto p-2">
          {isPending && <AnimatedLoading />}

          {error && !isPending && (
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle className="text-destructive text-base">
                  Erro ao carregar o membro
                </CardTitle>
                <CardDescription>{errMessage}</CardDescription>
              </CardHeader>
            </Card>
          )}

          {data && !isPending && !enterpriseId && (
            <Card>
              <CardHeader>
                <CardTitle>Membro não encontrado</CardTitle>
                <CardDescription>
                  Este vínculo não pertence à classe esperada.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {data && !isPending && enterpriseId && (
            <MemberDetailView
              member={data}
              enterpriseId={enterpriseId}
            />
          )}
        </div>

        {data && !isPending && (
          <SheetFooter className="shrink-0 border-t p-2">
            <Button variant="default" size="sm" asChild>
              <Link href={`/members/${memberId}`}>
                <Pencil className="size-4" aria-hidden />
                Editar
              </Link>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
