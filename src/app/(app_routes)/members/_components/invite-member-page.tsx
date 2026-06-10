"use client"

import { InviteMemberForm } from "@/app/(app_routes)/members/_components/invite-member-form"
import { MembershipPageHeader } from "@/app/(app_routes)/members/_components/membership-page-header"
import { MembershipFormContentLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { RouteBreadcrumb } from "@/components/global/route-breadcrumb"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { useOperatorPermissions } from "@/lib/permissions"
import type { MembershipRouteConfig } from "@/modules/memberships/membership-route-config"

export function InviteMemberPageContent({
  config,
}: {
  config: MembershipRouteConfig
}) {
  const { ready, enterpriseId } = useRequireEnterprise()
  const perms = useOperatorPermissions()

  if (!ready || !perms.isReady) {
    return (
      <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
        <Skeleton className="h-4 w-48" />
        <MembershipFormContentLoading config={config} />
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
        <RouteBreadcrumb />
      </main>
    )
  }

  if (!enterpriseId) return null

  if (!perms.canIncludeMembers) {
    return (
      <main className="mx-auto flex w-full max-w-lg flex-col gap-6 p-4 md:p-8">
        <RouteBreadcrumb />
        <Card>
          <CardHeader>
            <CardTitle>Sem permissão</CardTitle>
            <CardDescription>
              Necessita da permissão incluir_membros.
            </CardDescription>
          </CardHeader>
        </Card>
      </main>
    )
  }

  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <RouteBreadcrumb />
      <div className="space-y-6">
        <MembershipPageHeader
          title={config.invite.title}
          description={config.invite.description}
          note={config.invite.note}
        />
        <InviteMemberForm enterpriseId={enterpriseId} config={config} />
      </div>
    </main>
  )
}
