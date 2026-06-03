import { apiFetch } from "@/lib/api/client"
import { successEnvelopeSchema } from "@/lib/api/envelope"
import {
  enterpriseDetailSchema,
  enterpriseSchema,
  updateEnterpriseRequestSchema,
  type UpdateEnterpriseRequest,
} from "@/modules/enterprises/enterprises.schema"

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
