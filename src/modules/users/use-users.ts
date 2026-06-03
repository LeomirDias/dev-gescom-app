"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ListUsersQuery, UpdateUserRequest } from "@/modules/users/users.schema"
import {
  getUserService,
  listUsersService,
  updateUserService,
} from "@/modules/users/users.service"

export function usersQueryKey(
  enterpriseId: string,
  filters?: ListUsersQuery
) {
  return ["users", enterpriseId, filters ?? {}] as const
}

export function userQueryKey(enterpriseId: string, userId: string) {
  return ["users", enterpriseId, userId] as const
}

export function useUsersQuery({
  enterpriseId,
  filters = {},
  enabled = true,
}: {
  enterpriseId: string | undefined
  filters?: ListUsersQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: usersQueryKey(enterpriseId ?? "", filters),
    queryFn: () => listUsersService(enterpriseId!, filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: 0,
  })
}

export function useUserQuery({
  enterpriseId,
  userId,
  enabled = true,
  retry = true,
}: {
  enterpriseId: string | undefined
  userId: string | undefined
  enabled?: boolean
  retry?: boolean | number
}) {
  return useQuery({
    queryKey: userQueryKey(enterpriseId ?? "", userId ?? ""),
    queryFn: () => getUserService(enterpriseId!, userId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(userId),
    staleTime: 0,
    retry,
  })
}

export function useUpdateUserMutation(enterpriseId: string, userId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateUserRequest) =>
      updateUserService(enterpriseId, userId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users", enterpriseId] })
      void queryClient.invalidateQueries({ queryKey: ["account", "me"] })
      toast.success("Perfil atualizado com sucesso!")
    },
  })
}
