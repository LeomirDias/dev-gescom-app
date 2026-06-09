import { apiFetch } from "@/lib/api/client"
import { paginatedEnvelopeSchema, successEnvelopeSchema } from "@/lib/api/envelope"
import {
  buildEnterprisesQuery,
  enterpriseDetailSchema,
  enterpriseListItemSchema,
  enterpriseSchema,
  updateEnterpriseRequestSchema,
  type ListEnterprisesQuery,
  type UpdateEnterpriseRequest,
} from "@/modules/enterprises/enterprises.schema"

export async function listEnterprisesService(query: ListEnterprisesQuery = {}) {
  const qs = buildEnterprisesQuery(query)
  const raw = await apiFetch<unknown>(`enterprises${qs}`, { method: "GET" })
  const envelope = paginatedEnvelopeSchema(enterpriseListItemSchema).parse(raw)
  return { items: envelope.data, ...envelope.pagination }
}

export async function getEnterpriseByIdService(enterpriseId: string) {
  const raw = await apiFetch<unknown>(`enterprises/${enterpriseId}`, {
    method: "GET",
  })
  return successEnvelopeSchema(enterpriseDetailSchema).parse(raw).data
}

export async function updateEnterpriseService(
  enterpriseId: string,
  input: UpdateEnterpriseRequest
) {
  const body = updateEnterpriseRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(`enterprises/${enterpriseId}`, {
    method: "PATCH",
    body,
  })
  return successEnvelopeSchema(enterpriseSchema).parse(raw).data
}
