import { z } from "zod"
import { enterpriseMemberClassSchema } from "@/modules/authentication/auth.schema"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"

export { enterpriseMemberClassSchema }

export type EnterpriseMemberClass = z.infer<typeof enterpriseMemberClassSchema>

export const memberStatusSchema = z.enum([
  "ATIVO",
  "INATIVO",
  "BLOQUEADO",
  "PENDENTE",
  "ESPECIAL",
  "COBRANCA",
  "NAO_VENDER",
])

export type MemberStatus = z.infer<typeof memberStatusSchema>

export const permissionStatusSchema = z.enum(["ALLOW", "DENIED"])

export type PermissionStatus = z.infer<typeof permissionStatusSchema>

export const memberDepartmentPayloadSchema = z.strictObject({
  departmentId: z.uuid(),
  mainDepartment: z.boolean(),
})

export type MemberDepartmentPayload = z.infer<
  typeof memberDepartmentPayloadSchema
>

export const memberUserSummarySchema = z.object({
  id: z.uuid(),
  userName: z.string(),
  userRegistration: z.string(),
  userEmail: z.string(),
  userPhone: z.string(),
})

export type MemberUserSummary = z.infer<typeof memberUserSummarySchema>

export const memberSchema = z.object({
  id: z.uuid(),
  status: memberStatusSchema,
  userId: z.uuid(),
  enterpriseId: z.uuid(),
  class: enterpriseMemberClassSchema,
  includedBy: z.uuid(),
  registeredOn: z.string(),
  approvedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
})

export type Member = z.infer<typeof memberSchema>

export const memberListItemSchema = memberSchema.extend({
  user: memberUserSummarySchema,
})

export type MemberListItem = z.infer<typeof memberListItemSchema>

export const listMembersQuerySchema = z.object({
  userId: z.uuid().optional(),
  class: enterpriseMemberClassSchema.optional(),
  status: memberStatusSchema.optional(),
  registration: cpfCnpjSchema.optional(),
  email: z.string().trim().email().max(255).optional(),
  phone: phoneE164Schema.optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
})

export type ListMembersQuery = z.infer<typeof listMembersQuerySchema>

export const listMembersResponseSchema = z.object({
  items: z.array(memberListItemSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
})

export type ListMembersResponse = z.infer<typeof listMembersResponseSchema>

/** Departamento no detalhe do membro (`GET /:memberId`). */
export const memberDepartmentPermissionItemSchema = z.object({
  id: z.uuid(),
  permission: z.string(),
  status: permissionStatusSchema,
})

export type MemberDepartmentPermissionItem = z.infer<
  typeof memberDepartmentPermissionItemSchema
>

export const memberDepartmentInDetailSchema = z.object({
  id: z.uuid(),
  departmentId: z.uuid(),
  name: z.string().optional(),
  mainDepartment: z.boolean(),
  status: memberStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string().nullable().optional(),
  permissionsDefault: z
    .array(memberDepartmentPermissionItemSchema)
    .default([]),
  extraPermissions: z.array(memberDepartmentPermissionItemSchema).default([]),
  permissions: z.array(z.string()).default([]),
})

export type MemberDepartment = z.infer<typeof memberDepartmentInDetailSchema>

/** Resposta de `POST`/`PATCH` em vínculos membro-departamento — inclui `memberId`. */
export const memberDepartmentMutationSchema =
  memberDepartmentInDetailSchema.extend({
    memberId: z.uuid(),
  })

export type MemberDepartmentMutation = z.infer<
  typeof memberDepartmentMutationSchema
>

export const memberDetailSchema = memberSchema.extend({
  user: memberUserSummarySchema,
  departments: z.array(memberDepartmentInDetailSchema),
})

export type MemberDetail = z.infer<typeof memberDetailSchema>

export const createMemberWithUserRequestSchema = z.strictObject({
  user: z.strictObject({
    userName: z.string().trim().min(2).max(255),
    userRegistration: cpfCnpjSchema,
    userEmail: z.string().trim().email().max(255),
    userPhone: phoneE164Schema,
  }),
  member: z.strictObject({
    class: enterpriseMemberClassSchema,
    departments: z.array(memberDepartmentPayloadSchema),
  }),
})

export type CreateMemberWithUserRequest = z.infer<
  typeof createMemberWithUserRequestSchema
>

export const createMemberWithUserResponseSchema = z.object({
  user: z.object({
    id: z.uuid(),
    userName: z.string(),
    userRegistration: z.string(),
    userEmail: z.string(),
    userPhone: z.string(),
  }),
  member: memberSchema,
})

export type CreateMemberWithUserResponse = z.infer<
  typeof createMemberWithUserResponseSchema
>

export const inviteMemberRequestSchema = z
  .strictObject({
    member: z.strictObject({
      class: enterpriseMemberClassSchema,
      departments: z.array(memberDepartmentPayloadSchema),
    }),
    inviteEmail: z.string().trim().email().max(255).optional(),
    invitePhone: phoneE164Schema.optional(),
  })
  .refine((d) => Boolean(d.inviteEmail || d.invitePhone), {
    message: "Informe e-mail ou telefone.",
  })

export type InviteMemberRequest = z.infer<typeof inviteMemberRequestSchema>

export const inviteMemberResponseSchema = z.object({
  memberId: z.uuid(),
})

export type InviteMemberResponse = z.infer<typeof inviteMemberResponseSchema>

export const createMemberRequestSchema = z.strictObject({
  userId: z.uuid(),
  class: enterpriseMemberClassSchema,
  departments: z.array(memberDepartmentPayloadSchema),
})

export type CreateMemberRequest = z.infer<typeof createMemberRequestSchema>

export const updateMemberRequestSchema = z
  .strictObject({
    class: enterpriseMemberClassSchema.optional(),
    status: memberStatusSchema.optional(),
    softDelete: z.literal(true).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Informe ao menos um campo.",
  })

export type UpdateMemberRequest = z.infer<typeof updateMemberRequestSchema>

export const addMemberDepartmentRequestSchema = z.strictObject({
  departmentId: z.uuid(),
  mainDepartment: z.boolean(),
})

export type AddMemberDepartmentRequest = z.infer<
  typeof addMemberDepartmentRequestSchema
>

export const updateMemberDepartmentRequestSchema = z
  .strictObject({
    departmentId: z.uuid().optional(),
    mainDepartment: z.boolean().optional(),
    status: memberStatusSchema.optional(),
    softDelete: z.literal(true).optional(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "Informe ao menos um campo.",
  })

export type UpdateMemberDepartmentRequest = z.infer<
  typeof updateMemberDepartmentRequestSchema
>

export const updateMemberPermissionRequestSchema = z
  .strictObject({
    permission: z.string().min(1),
    status: permissionStatusSchema.optional(),
    softDelete: z.literal(true).optional(),
  })
  .refine((d) => d.softDelete === true || d.status !== undefined, {
    message: "Informe status ou softDelete.",
  })

export type UpdateMemberPermissionRequest = z.infer<
  typeof updateMemberPermissionRequestSchema
>

export const memberPermissionSchema = z.object({
  id: z.uuid(),
  permission: z.string(),
  status: permissionStatusSchema,
  memberDepartmentId: z.uuid().optional(),
  updatedAt: z.string().nullable().optional(),
})

export type MemberPermission = z.infer<typeof memberPermissionSchema>
