import { apiFetch } from "@/lib/api/client"
import { paginatedEnvelopeSchema, successEnvelopeSchema } from "@/lib/api/envelope"
import {
  addMemberDepartmentRequestSchema,
  createMemberRequestSchema,
  createMemberWithUserRequestSchema,
  createMemberWithUserResponseSchema,
  inviteMemberRequestSchema,
  inviteMemberResponseSchema,
  listMembersQuerySchema,
  memberListItemSchema,
  memberDepartmentMutationSchema,
  memberDetailSchema,
  memberPermissionSchema,
  memberSchema,
  updateMemberDepartmentRequestSchema,
  updateMemberPermissionRequestSchema,
  updateMemberRequestSchema,
  type AddMemberDepartmentRequest,
  type CreateMemberRequest,
  type CreateMemberWithUserRequest,
  type InviteMemberRequest,
  type ListMembersQuery,
  type UpdateMemberDepartmentRequest,
  type UpdateMemberPermissionRequest,
  type UpdateMemberRequest,
} from "@/modules/memberships/memberships.schema"

function membersBase(enterpriseId: string) {
  return `enterprises/${enterpriseId}/members`
}

function buildMembersQuery(query: ListMembersQuery): string {
  const parsed = listMembersQuerySchema.parse(query)
  const params = new URLSearchParams()
  if (parsed.userId) params.set("userId", parsed.userId)
  if (parsed.class) params.set("class", parsed.class)
  if (parsed.status) params.set("status", parsed.status)
  if (parsed.registration) params.set("registration", parsed.registration)
  if (parsed.email) params.set("email", parsed.email)
  if (parsed.phone) params.set("phone", parsed.phone)
  if (parsed.limit !== undefined) params.set("limit", String(parsed.limit))
  if (parsed.offset !== undefined) params.set("offset", String(parsed.offset))
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export async function listMembersService(
  enterpriseId: string,
  query: ListMembersQuery = {}
) {
  const raw = await apiFetch<unknown>(
    `${membersBase(enterpriseId)}${buildMembersQuery(query)}`,
    { method: "GET" }
  )
  const envelope = paginatedEnvelopeSchema(memberListItemSchema).parse(raw)
  return { items: envelope.data, ...envelope.pagination }
}

export async function getMemberService(enterpriseId: string, memberId: string) {
  const raw = await apiFetch<unknown>(
    `${membersBase(enterpriseId)}/${memberId}`,
    { method: "GET" }
  )
  return successEnvelopeSchema(memberDetailSchema).parse(raw).data
}

export async function createMemberWithUserService(
  enterpriseId: string,
  input: CreateMemberWithUserRequest
) {
  const body = createMemberWithUserRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${membersBase(enterpriseId)}/create-with-user`,
    { method: "POST", body }
  )
  return successEnvelopeSchema(createMemberWithUserResponseSchema).parse(raw).data
}

export async function inviteMemberService(
  enterpriseId: string,
  input: InviteMemberRequest
) {
  const body = inviteMemberRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`${membersBase(enterpriseId)}/invite`, {
    method: "POST",
    body,
  })
  return successEnvelopeSchema(inviteMemberResponseSchema).parse(raw).data
}

export async function createMemberService(
  enterpriseId: string,
  input: CreateMemberRequest
) {
  const body = createMemberRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(membersBase(enterpriseId), {
    method: "POST",
    body,
  })
  return successEnvelopeSchema(memberSchema).parse(raw).data
}

export async function updateMemberService(
  enterpriseId: string,
  memberId: string,
  input: UpdateMemberRequest
) {
  const body = updateMemberRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${membersBase(enterpriseId)}/${memberId}`,
    { method: "PATCH", body }
  )
  return successEnvelopeSchema(memberSchema).parse(raw).data
}

export async function addMemberDepartmentService(
  enterpriseId: string,
  memberId: string,
  input: AddMemberDepartmentRequest
) {
  const body = addMemberDepartmentRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${membersBase(enterpriseId)}/${memberId}/departments`,
    { method: "POST", body }
  )
  return successEnvelopeSchema(memberDepartmentMutationSchema).parse(raw).data
}

export async function updateMemberDepartmentService(
  enterpriseId: string,
  memberId: string,
  memberDepartmentId: string,
  input: UpdateMemberDepartmentRequest
) {
  const body = updateMemberDepartmentRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${membersBase(enterpriseId)}/${memberId}/departments/${memberDepartmentId}`,
    { method: "PATCH", body }
  )
  return successEnvelopeSchema(memberDepartmentMutationSchema).parse(raw).data
}

export async function updateMemberPermissionDefaultService(
  enterpriseId: string,
  memberId: string,
  departmentId: string,
  input: UpdateMemberPermissionRequest
) {
  const body = updateMemberPermissionRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${membersBase(enterpriseId)}/${memberId}/departments/${departmentId}/permissions-default`,
    { method: "PATCH", body }
  )
  return successEnvelopeSchema(memberPermissionSchema).parse(raw).data
}

export async function updateMemberExtraPermissionService(
  enterpriseId: string,
  memberId: string,
  departmentId: string,
  input: UpdateMemberPermissionRequest
) {
  const body = updateMemberPermissionRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${membersBase(enterpriseId)}/${memberId}/departments/${departmentId}/extra-permissions`,
    { method: "PATCH", body }
  )
  return successEnvelopeSchema(memberPermissionSchema).parse(raw).data
}
