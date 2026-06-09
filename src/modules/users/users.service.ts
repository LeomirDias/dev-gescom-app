import { apiFetch } from "@/lib/api/client"
import { paginatedEnvelopeSchema, successEnvelopeSchema } from "@/lib/api/envelope"
import {
  listUsersQuerySchema,
  userPublicSchema,
  createUserRequestSchema,
  createUserResponseSchema,
  updateUserRequestSchema,
  updateUserResponseSchema,
  type CreateUserRequest,
  type ListUsersQuery,
  type UpdateUserRequest,
} from "@/modules/users/users.schema"

function usersBase(enterpriseId: string) {
  return `enterprises/${enterpriseId}/users`
}

function buildUsersQuery(query: ListUsersQuery): string {
  const parsed = listUsersQuerySchema.parse(query)
  const params = new URLSearchParams()
  if (parsed.registration) params.set("registration", parsed.registration)
  if (parsed.email) params.set("email", parsed.email)
  if (parsed.phone) params.set("phone", parsed.phone)
  if (parsed.limit !== undefined) params.set("limit", String(parsed.limit))
  if (parsed.offset !== undefined) params.set("offset", String(parsed.offset))
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export async function listUsersService(
  enterpriseId: string,
  query: ListUsersQuery = {}
) {
  const raw = await apiFetch<unknown>(
    `${usersBase(enterpriseId)}${buildUsersQuery(query)}`,
    { method: "GET" }
  )
  const envelope = paginatedEnvelopeSchema(userPublicSchema).parse(raw)
  return { items: envelope.data, ...envelope.pagination }
}

export async function getUserService(enterpriseId: string, userId: string) {
  const raw = await apiFetch<unknown>(
    `${usersBase(enterpriseId)}/${userId}`,
    { method: "GET" }
  )
  return successEnvelopeSchema(userPublicSchema).parse(raw).data
}

export async function createUserService(
  enterpriseId: string,
  input: CreateUserRequest
) {
  const body = createUserRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(usersBase(enterpriseId), {
    method: "POST",
    body,
  })
  return successEnvelopeSchema(createUserResponseSchema).parse(raw).data
}

export async function updateUserService(
  enterpriseId: string,
  userId: string,
  input: UpdateUserRequest
) {
  const body = updateUserRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${usersBase(enterpriseId)}/${userId}`,
    { method: "PATCH", body }
  )
  return successEnvelopeSchema(updateUserResponseSchema).parse(raw).data
}
