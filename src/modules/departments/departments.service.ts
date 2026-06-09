import { apiFetch } from "@/lib/api/client"
import { paginatedEnvelopeSchema, successEnvelopeSchema } from "@/lib/api/envelope"
import {
  buildDepartmentsQuery,
  departmentSchema,
  type Department,
  type ListDepartmentsQuery,
} from "@/modules/departments/departments.schema"

export async function listDepartmentsService(query: ListDepartmentsQuery = {}) {
  const qs = buildDepartmentsQuery(query)
  const raw = await apiFetch<unknown>(`departments${qs}`, { method: "GET" })
  const envelope = paginatedEnvelopeSchema(departmentSchema).parse(raw)
  return { items: envelope.data, ...envelope.pagination }
}

export async function getDepartmentService(departmentId: string): Promise<Department> {
  const raw = await apiFetch<unknown>(`departments/${departmentId}`, {
    method: "GET",
  })
  return successEnvelopeSchema(departmentSchema).parse(raw).data
}

export async function listActiveDepartmentsService() {
  const { items } = await listDepartmentsService({ limit: 100, offset: 0 })
  return items
    .filter((d) => d.status === "ATIVO")
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"))
}
