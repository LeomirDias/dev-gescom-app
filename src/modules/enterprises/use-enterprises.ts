"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAuth } from "@/components/providers/authentication/auth-store"
import {
  getEnterpriseByIdService,
  updateEnterpriseService,
} from "@/modules/enterprises/enterprises.service"
import type {
  EnterpriseDetail,
  UpdateEnterpriseRequest,
} from "@/modules/enterprises/enterprises.schema"

export function enterpriseDetailQueryKey(enterpriseId: string) {
  return ["enterprises", enterpriseId, "detail"] as const
}

export function useEnterpriseDetailQuery({
  enterpriseId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: enterpriseDetailQueryKey(enterpriseId ?? ""),
    queryFn: () => getEnterpriseByIdService(enterpriseId!),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: 0,
  })
}

export function useUpdateEnterpriseMutation(enterpriseId: string) {
  const queryClient = useQueryClient()
  const { refreshSession } = useAuth()

  return useMutation({
    mutationFn: (input: UpdateEnterpriseRequest) =>
      updateEnterpriseService(enterpriseId, input),
    onSuccess: async (data) => {
      queryClient.setQueryData<EnterpriseDetail | undefined>(
        enterpriseDetailQueryKey(enterpriseId),
        (previous) =>
          previous
            ? { ...previous, ...data }
            : undefined
      )
      void queryClient.invalidateQueries({ queryKey: ["account", "me"] })
      try {
        await refreshSession()
      } catch {
        // Mantém sucesso da alteração mesmo se a sincronização da sessão falhar
      }
      toast.success("Empresa atualizada com sucesso.")
    },
  })
}
