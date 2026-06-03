"use client"

import Link from "next/link"
import { InviteMemberForm } from "@/app/(app_routes)/members/_components/invite-member-form"
import { MEMBERS_BASE_PATH } from "@/app/(app_routes)/members/_components/members-constants"
import { MemberFormContentLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"

export default function InviteMemberPage() {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  if (!ready || !perms.isReady) {
    return (
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <MemberFormContentLoading />
      </main>
    )
  }

  if (perms.isError) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Não foi possível carregar permissões</CardTitle>
            <CardDescription>
              Não foi possível obter as permissões da sessão. Tente atualizar a
              página ou iniciar sessão novamente.
            </CardDescription>
          </CardHeader>
        </Card>
        <Button asChild variant="outline">
          <Link href={MEMBERS_BASE_PATH}>Voltar</Link>
        </Button>
      </main>
    )
  }

  if (!enterpriseId) return null

  if (!perms.canIncludeMembers) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Sem permissão</CardTitle>
            <CardDescription>
              Necessita da permissão incluir_membros.
            </CardDescription>
          </CardHeader>
        </Card>
        <Button asChild variant="outline">
          <Link href={MEMBERS_BASE_PATH}>Voltar</Link>
        </Button>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <InviteMemberForm enterpriseId={enterpriseId} />
    </main>
  )
}
