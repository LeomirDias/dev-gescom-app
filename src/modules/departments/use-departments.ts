"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/components/providers/authentication/auth-store"
import { useOperatorPermissions } from "@/lib/permissions"
import { listActiveDepartmentsService } from "@/modules/departments/departments.service"

export function departmentsQueryKey(enterpriseId: string) {
  return ["departments", enterpriseId] as const
}

export function useDepartmentsQuery(enabled = true) {
  const { activeEnterprise } = useAuth()
  const enterpriseId = activeEnterprise?.id
  const perms = useOperatorPermissions()
  return useQuery({
    queryKey: departmentsQueryKey(enterpriseId ?? ""),
    queryFn: () => listActiveDepartmentsService(),
    enabled: enabled && Boolean(enterpriseId) && perms.canConsultDepartments,
    staleTime: 60_000,
  })
}
