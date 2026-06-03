import { z } from "zod"

export const departmentStatusSchema = z.enum([
  "ATIVO",
  "INATIVO",
  "BLOQUEADO",
  "PENDENTE",
  "ESPECIAL",
  "COBRANCA",
  "NAO_VENDER",
])

export type DepartmentStatus = z.infer<typeof departmentStatusSchema>

export const departmentSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  status: departmentStatusSchema,
  permissionReference: z.string(),
  registeredOn: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
})

export type Department = z.infer<typeof departmentSchema>

export const listDepartmentsResponseSchema = z.array(departmentSchema)

export type ListDepartmentsResponse = z.infer<typeof listDepartmentsResponseSchema>
