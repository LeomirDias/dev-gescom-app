"use client"

import { CreateClientForm } from "@/app/(app_routes)/clients/new/_components/create-client-form"
import { EnterprisePermissionGuard } from "@/components/global/guards/enterprise-permission-guard"
import { PERMISSION_CODES } from "@/lib/permissions"

export function CreateClientPage({
  enterpriseId,
}: {
  enterpriseId: string
}) {
  return (
    <EnterprisePermissionGuard
      check={(p) => p.canIncludeMembers}
      permissionLabel={PERMISSION_CODES.incluirMembros}
    >
      <main className="mx-auto flex w-full flex-col gap-6 p-4 border-none">
        <CreateClientForm
          enterpriseId={enterpriseId}
          class="CLIENTE"
          title="Novo cliente"
          subtitle="Crie um novo cliente com um novo usuário"
          submitLabel="Criar cliente"
          pendingLabel="Criando cliente..."
        />
      </main>
    </EnterprisePermissionGuard>
  )
}
