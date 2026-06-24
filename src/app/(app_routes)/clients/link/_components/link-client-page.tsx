"use client"

import { LinkClientForm } from "@/app/(app_routes)/clients/link/_components/link-client-form"
import { EnterprisePermissionGuard } from "@/components/global/guards/enterprise-permission-guard"
import { PERMISSION_CODES } from "@/lib/permissions"

export function LinkClientPage({
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
        <LinkClientForm enterpriseId={enterpriseId} />
      </main>
    </EnterprisePermissionGuard>
  )
}
