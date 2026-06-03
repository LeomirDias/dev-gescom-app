"use client"

import { useQuery } from "@tanstack/react-query"
import { useOperatorPermissions } from "@/lib/permissions"
import { listActiveDepartmentsService } from "@/modules/departments/departments.service"

export const departmentsQueryKey = ["departments"] as const

export function useDepartmentsQuery(enabled = true) {
  const perms = useOperatorPermissions()
  return useQuery({
    queryKey: departmentsQueryKey,
    queryFn: () => listActiveDepartmentsService(),
    enabled: enabled && perms.canConsultDepartments,
    staleTime: 60_000,
  })
}
