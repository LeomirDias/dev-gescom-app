import { apiFetch } from "@/lib/api/client"
import { successEnvelopeSchema } from "@/lib/api/envelope"
import {
  listDepartmentsResponseSchema,
  type ListDepartmentsResponse,
} from "@/modules/departments/departments.schema"

export async function listDepartmentsService(): Promise<ListDepartmentsResponse> {
  const raw = await apiFetch<unknown>("departments", { method: "GET" })
  return successEnvelopeSchema(listDepartmentsResponseSchema).parse(raw).data
}

export async function listActiveDepartmentsService() {
  const items = await listDepartmentsService()
  return items
    .filter((d) => d.status === "ATIVO")
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
}
