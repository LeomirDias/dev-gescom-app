"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createEnterpriseAddressService,
  patchEnterpriseAddressService,
} from "@/modules/enterprises/enterprise-addresses.service"
import type {
  CreateEnterpriseAddressRequest,
  PatchEnterpriseAddressRequest,
} from "@/modules/enterprises/enterprise-addresses.schema"
import { enterpriseDetailQueryKey } from "@/modules/enterprises/use-enterprises"

export function enterpriseAddressesQueryKey(
  enterpriseId: string,
  filters?: { adressType?: string }
) {
  return ["enterprises", enterpriseId, "addresses", filters ?? {}] as const
}

function useInvalidateEnterpriseDetail(enterpriseId: string) {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({
      queryKey: enterpriseDetailQueryKey(enterpriseId),
    })
  }
}

export function useCreateEnterpriseAddressMutation(enterpriseId: string) {
  const invalidate = useInvalidateEnterpriseDetail(enterpriseId)
  return useMutation({
    mutationFn: (input: CreateEnterpriseAddressRequest) =>
      createEnterpriseAddressService(enterpriseId, input),
    onSuccess: () => {
      invalidate()
      toast.success("Endereço cadastrado com sucesso.")
    },
  })
}

export function usePatchEnterpriseAddressMutation(enterpriseId: string) {
  const invalidate = useInvalidateEnterpriseDetail(enterpriseId)
  return useMutation({
    mutationFn: ({
      addressId,
      input,
    }: {
      addressId: string
      input: PatchEnterpriseAddressRequest
    }) => patchEnterpriseAddressService(enterpriseId, addressId, input),
    onSuccess: (_data, variables) => {
      invalidate()
      if (variables.input.softDelete) {
        toast.success("Endereço removido com sucesso.")
      } else {
        toast.success("Endereço atualizado com sucesso.")
      }
    },
  })
}
