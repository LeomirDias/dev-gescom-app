import { cn } from "@/lib/utils"
import { getMemberStatusLabel } from "@/modules/memberships/member-status-label"

const STATUS_STYLES: Record<string, string> = {
  ATIVO: "border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  PENDENTE:
    "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100",
  INATIVO: "border-border bg-muted/50 text-muted-foreground",
  BLOQUEADO: "border-destructive/40 bg-destructive/10 text-destructive",
}

export function MemberStatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ??
          "border-border bg-muted/30 text-muted-foreground",
        className
      )}
    >
      {getMemberStatusLabel(status)}
    </span>
  )
}
