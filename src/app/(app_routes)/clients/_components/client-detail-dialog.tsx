"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"

import { MemberDetailView } from "@/app/(app_routes)/members/_components/member-detail-view"
import { AnimatedLoading } from "@/components/global/loading/animated-loading"
import { EntityDetailSheet } from "@/components/global/sheets/entity-detail-sheet"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import { isClienteClass } from "@/modules/memberships/memberships-rules"
import { useMemberQuery } from "@/modules/memberships/use-members"

type ClientDetailDialogProps = {
  clientId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientDetailDialog({
  clientId,
  open,
  onOpenChange,
}: ClientDetailDialogProps) {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  const { data, error, isPending } = useMemberQuery({
    enterpriseId,
    memberId: clientId,
    enabled: open && ready && perms.canConsultMembers && Boolean(clientId),
  })

  const isWrongClass = data && !isClienteClass(data.class)

  const notFound = isWrongClass ? (
    <Card>
      <CardHeader>
        <CardTitle>Cliente não encontrado</CardTitle>
        <CardDescription>
          Este vínculo não pertence à classe cliente.
        </CardDescription>
      </CardHeader>
    </Card>
  ) : null

  return (
    <EntityDetailSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Cliente"
      description="Visualização rápida do cliente"
      isPending={isPending}
      error={error}
      errorTitle="Erro ao carregar o cliente"
      fallbackErrorMessage="Não foi possível carregar o cliente."
      loading={<AnimatedLoading />}
      contentClassName="w-full h-full p-2"
      sheetClassName="w-auto"
      footer={
        data && !isPending && !isWrongClass ? (
          <div className="p-2">
            <Button variant="default" size="sm" asChild>
              <Link href={`/clients/${clientId}`}>
                <Pencil className="size-4" aria-hidden />
                Editar
              </Link>
            </Button>
          </div>
        ) : undefined
      }
      notFound={notFound}
    >
      {data && enterpriseId && !isWrongClass ? (
        <MemberDetailView member={data} enterpriseId={enterpriseId} />
      ) : null}
    </EntityDetailSheet>
  )
}
