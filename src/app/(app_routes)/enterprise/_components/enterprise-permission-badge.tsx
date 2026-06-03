"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatPermissionLabel } from "@/lib/permission-label"
import { cn } from "@/lib/utils"

type EnterprisePermissionBadgeProps = {
  permission: string
  className?: string
}

export function EnterprisePermissionBadge({
  permission,
  className,
}: EnterprisePermissionBadgeProps) {
  const label = formatPermissionLabel(permission)

  return (
    <Tooltip>
      <TooltipTrigger asChild className="block w-full min-w-0">
        <span
          tabIndex={0}
          className={cn(
            "flex h-9 w-full min-w-0 items-center justify-center rounded-md border border-primary/20 bg-linear-to-r from-primary/10 to-primary/5 px-3 text-xs font-medium text-foreground shadow-xs outline-none transition-[background-color,box-shadow] hover:border-primary/30 hover:from-primary/15 hover:to-primary/8 focus-visible:ring-2 focus-visible:ring-primary/40",
            className
          )}
        >
          <span className="truncate text-center">{label}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="font-mono text-xs">
        {permission}
      </TooltipContent>
    </Tooltip>
  )
}
