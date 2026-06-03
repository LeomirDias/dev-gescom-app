"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"
import {
  addMemberDepartmentService,
  createMemberService,
  createMemberWithUserService,
  getMemberService,
  inviteMemberService,
  listMembersService,
  updateMemberDepartmentService,
  updateMemberExtraPermissionService,
  updateMemberPermissionDefaultService,
  updateMemberService,
} from "@/modules/memberships/memberships.service"

export function membersQueryKey(
  enterpriseId: string,
  filters?: ListMembersQuery
) {
  return ["memberships", enterpriseId, filters ?? {}] as const
}

export function memberQueryKey(enterpriseId: string, memberId: string) {
  return ["memberships", enterpriseId, memberId] as const
}

export function useMembersQuery({
  enterpriseId,
  filters = {},
  enabled = true,
}: {
  enterpriseId: string | undefined
  filters?: ListMembersQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: membersQueryKey(enterpriseId ?? "", filters),
    queryFn: () => listMembersService(enterpriseId!, filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: 0,
  })
}

export function useMemberQuery({
  enterpriseId,
  memberId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  memberId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: memberQueryKey(enterpriseId ?? "", memberId ?? ""),
    queryFn: () => getMemberService(enterpriseId!, memberId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(memberId),
    staleTime: 0,
  })
}

function useInvalidateMembers(enterpriseId: string, memberId?: string) {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({
      queryKey: ["memberships", enterpriseId],
    })
    if (memberId) {
      void queryClient.invalidateQueries({
        queryKey: memberQueryKey(enterpriseId, memberId),
      })
    }
  }
}

export function useCreateMemberWithUserMutation(enterpriseId: string) {
  const invalidate = useInvalidateMembers(enterpriseId)
  return useMutation({
    mutationFn: createMemberWithUserService.bind(null, enterpriseId),
    onSuccess: () => {
      invalidate()
      toast.success("Membro criado com sucesso.")
    },
  })
}

export function useInviteMemberMutation(enterpriseId: string) {
  const invalidate = useInvalidateMembers(enterpriseId)
  return useMutation({
    mutationFn: inviteMemberService.bind(null, enterpriseId),
    onSuccess: () => {
      invalidate()
      toast.success("Convite enviado com sucesso.")
    },
  })
}

export function useCreateMemberMutation(enterpriseId: string) {
  const invalidate = useInvalidateMembers(enterpriseId)
  return useMutation({
    mutationFn: createMemberService.bind(null, enterpriseId),
    onSuccess: () => {
      invalidate()
      toast.success("Vinculo criado com sucesso.")
    },
  })
}

export function useUpdateMemberMutation(
  enterpriseId: string,
  memberId: string
) {
  const invalidate = useInvalidateMembers(enterpriseId, memberId)
  return useMutation({
    mutationFn: (input: Parameters<typeof updateMemberService>[2]) =>
      updateMemberService(enterpriseId, memberId, input),
    onSuccess: (_, variables) => {
      invalidate()
      if (variables.softDelete) {
        toast.success("Membro inactivado.")
      } else {
        toast.success("Membro actualizado.")
      }
    },
  })
}

export function useAddMemberDepartmentMutation(
  enterpriseId: string,
  memberId: string
) {
  const invalidate = useInvalidateMembers(enterpriseId, memberId)
  return useMutation({
    mutationFn: (input: Parameters<typeof addMemberDepartmentService>[2]) =>
      addMemberDepartmentService(enterpriseId, memberId, input),
    onSuccess: () => {
      invalidate()
      toast.success("Departamento vinculado.")
    },
  })
}

export function useUpdateMemberDepartmentMutation(
  enterpriseId: string,
  memberId: string
) {
  const invalidate = useInvalidateMembers(enterpriseId, memberId)
  return useMutation({
    mutationFn: ({
      memberDepartmentId,
      input,
    }: {
      memberDepartmentId: string
      input: Parameters<typeof updateMemberDepartmentService>[3]
    }) =>
      updateMemberDepartmentService(
        enterpriseId,
        memberId,
        memberDepartmentId,
        input
      ),
    onSuccess: (_, variables) => {
      invalidate()
      if (variables.input.softDelete) {
        toast.success("Vinculo de departamento removido.")
      } else {
        toast.success("Departamento actualizado.")
      }
    },
  })
}

export function useUpdateMemberPermissionDefaultMutation(
  enterpriseId: string,
  memberId: string
) {
  const invalidate = useInvalidateMembers(enterpriseId, memberId)
  return useMutation({
    mutationFn: ({
      departmentId,
      input,
    }: {
      departmentId: string
      input: Parameters<typeof updateMemberPermissionDefaultService>[3]
    }) =>
      updateMemberPermissionDefaultService(
        enterpriseId,
        memberId,
        departmentId,
        input
      ),
    onSuccess: (_, variables) => {
      invalidate()
      if (variables.input.softDelete) {
        toast.success("Permissao padrao removida.")
      } else {
        toast.success("Permissao padrao actualizada.")
      }
    },
  })
}

export function useUpdateMemberExtraPermissionMutation(
  enterpriseId: string,
  memberId: string
) {
  const invalidate = useInvalidateMembers(enterpriseId, memberId)
  return useMutation({
    mutationFn: ({
      departmentId,
      input,
    }: {
      departmentId: string
      input: Parameters<typeof updateMemberExtraPermissionService>[3]
    }) =>
      updateMemberExtraPermissionService(
        enterpriseId,
        memberId,
        departmentId,
        input
      ),
    onSuccess: (_, variables) => {
      invalidate()
      if (variables.input.softDelete) {
        toast.success("Permissao extra removida.")
      } else {
        toast.success("Permissao extra actualizada.")
      }
    },
  })
}
