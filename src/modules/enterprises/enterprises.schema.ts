import { z } from "zod"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"

/** Telefone na resposta pode vir em formato legado (ate 20 caracteres). */
export const enterpriseResponsePhoneSchema = z.string().max(20).nullable()

export const enterpriseStatusSchema = z.enum([
  "ATIVO",
  "INATIVO",
  "BLOQUEADO",
  "PENDENTE",
  "ESPECIAL",
  "COBRANCA",
  "NAO_VENDER",
])

export type EnterpriseStatus = z.infer<typeof enterpriseStatusSchema>

export const enterpriseAddressTypeSchema = z.enum([
  "PRINCIPAL",
  "SECUNDARIO",
  "COMERCIAL",
  "RESIDENCIAL",
  "ENTREGA",
  "COBRANCA",
  "FATURAMENTO",
  "OUTRO",
])

export type EnterpriseAddressType = z.infer<typeof enterpriseAddressTypeSchema>

export const enterpriseSchema = z.object({
  id: z.uuid(),
  status: enterpriseStatusSchema,
  registration: cpfCnpjSchema,
  legalName: z.string(),
  tradeName: z.string(),
  phone: enterpriseResponsePhoneSchema,
  email: z
    .string()
    .trim()
    .transform((v) => v.toLowerCase())
    .pipe(z.string().email().max(255))
    .nullable(),
  whatsapp: enterpriseResponsePhoneSchema,
  registeredOn: z.string(),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
})

export type Enterprise = z.infer<typeof enterpriseSchema>

export const enterpriseAddressSchema = z.object({
  id: z.uuid(),
  enterpriseId: z.uuid(),
  cepId: z.uuid(),
  countryId: z.uuid(),
  stateId: z.uuid(),
  cityId: z.uuid(),
  adressType: enterpriseAddressTypeSchema,
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
})

export type EnterpriseAddress = z.infer<typeof enterpriseAddressSchema>

export const enterpriseSequenceSchema = z.object({
  id: z.uuid(),
  enterpriseId: z.uuid(),
  sequence: z.string().max(255),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
})

export type EnterpriseSequence = z.infer<typeof enterpriseSequenceSchema>

export const enterpriseDetailSchema = enterpriseSchema.extend({
  addresses: z.array(enterpriseAddressSchema),
  sequences: z.array(enterpriseSequenceSchema),
})

export type EnterpriseDetail = z.infer<typeof enterpriseDetailSchema>

export const updateEnterpriseRequestSchema = z
  .strictObject({
    registration: cpfCnpjSchema.optional(),
    legalName: z.string().trim().min(2).max(255).optional(),
    tradeName: z.string().trim().min(2).max(255).optional(),
    phone: phoneE164Schema.optional(),
    email: z
      .string()
      .trim()
      .transform((v) => v.toLowerCase())
      .pipe(z.string().email().max(255))
      .optional(),
    whatsapp: phoneE164Schema.optional(),
  })
  .refine(
    (data) =>
      data.registration !== undefined ||
      data.legalName !== undefined ||
      data.tradeName !== undefined ||
      data.phone !== undefined ||
      data.email !== undefined ||
      data.whatsapp !== undefined,
    { message: "Informe ao menos um campo para alterar." }
  )

export type UpdateEnterpriseRequest = z.infer<typeof updateEnterpriseRequestSchema>
