"use client"

import Link from "next/link"
import { UserPlus, UserRoundPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import type {
  MembershipRouteConfig,
  MembershipRoutePermissions,
} from "@/modules/memberships/membership-route-config"

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function MembersListHeader({
  config,
  perms,
}: {
  config: MembershipRouteConfig
  perms: MembershipRoutePermissions
}) {
  const secondary = config.header.secondaryAction
  const showSecondary = secondary?.canShow(perms) ?? false

  const title = capitalize(config.labels.plural)
  const subtitle = `Gerencie e consulte os ${config.labels.plural} cadastrados`

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {perms.canCreateMemberWithUser && (
          <Button asChild tooltip={config.header.createTooltip}>
            <Link href={config.header.createHref}>
              <UserPlus className="size-4" aria-hidden />
              {config.header.createLabel}
            </Link>
          </Button>
        )}
        {showSecondary && secondary && (
          <Button asChild variant="outline" tooltip={secondary.tooltip}>
            <Link href={secondary.href}>
              <UserRoundPlus className="size-4" aria-hidden />
              {secondary.label}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
