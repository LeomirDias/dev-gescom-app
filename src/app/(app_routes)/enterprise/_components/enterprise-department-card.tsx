import { Layers, Shield } from "lucide-react"

import { EnterprisePermissionBadge } from "@/app/(app_routes)/enterprise/_components/enterprise-permission-badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type EnterpriseDepartmentCardProps = {
  department: {
    name: string
    permissions: string[]
    memberDepartmentId?: string
    mainDepartment?: boolean
  }
  isCurrentContext: boolean
}

export function EnterpriseDepartmentCard({
  department,
  isCurrentContext,
}: EnterpriseDepartmentCardProps) {
  return (
    <Card
      className={cn(
        "border-border/60 shadow-none",
        isCurrentContext &&
        "ring-2 ring-primary/40 ring-offset-2 ring-offset-background"
      )}
    >
      <CardHeader className="space-y-2 pb-3">
        <div className="flex justify-start items-center gap-2">
          <span className="w-auto min-w-0 flex gap-2 items-center justify-start">
            <Layers className="size-4" aria-hidden />
            <CardTitle className="text-base">{department.name}</CardTitle>
          </span>
          {department.mainDepartment && (
            <span className="p-2 rounded-full bg-primary/10 text-xs font-medium text-primary">
              Departamento principal
            </span>
          )}
        </div>

      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-base font-medium text-foreground">
            <Shield className="size-4" aria-hidden />
            Permissões ({department.permissions.length})
          </div>
        </div>
        {department.permissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma permissão neste vínculo.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-7">
            {department.permissions.map((permission, index) => (
              <li
                key={`${department.memberDepartmentId ?? "dept"}-${permission}-${index}`}
                className="min-w-0"
              >
                <EnterprisePermissionBadge permission={permission} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
