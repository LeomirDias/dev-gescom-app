import { z } from "zod"
import {
  enterpriseAddressSchema,
  enterpriseAddressTypeSchema,
} from "@/modules/enterprises/enterprises.schema"

export { enterpriseAddressTypeSchema, enterpriseAddressSchema }

export type EnterpriseAddressType = z.infer<typeof enterpriseAddressTypeSchema>

export const createEnterpriseAddressRequestSchema = z.strictObject({
  cepId: z.uuid(),
  countryId: z.uuid(),
  stateId: z.uuid(),
  cityId: z.uuid(),
  adressType: enterpriseAddressTypeSchema,
})

export type CreateEnterpriseAddressRequest = z.infer<
  typeof createEnterpriseAddressRequestSchema
>

export const patchEnterpriseAddressRequestSchema = z
  .strictObject({
    cepId: z.uuid().optional(),
    countryId: z.uuid().optional(),
    stateId: z.uuid().optional(),
    cityId: z.uuid().optional(),
    adressType: enterpriseAddressTypeSchema.optional(),
    softDelete: z.literal(true).optional(),
  })
  .refine(
    (data) =>
      data.cepId !== undefined ||
      data.countryId !== undefined ||
      data.stateId !== undefined ||
      data.cityId !== undefined ||
      data.adressType !== undefined ||
      data.softDelete === true,
    { message: "Informe ao menos um campo para alterar." }
  )

export type PatchEnterpriseAddressRequest = z.infer<
  typeof patchEnterpriseAddressRequestSchema
>

export const listEnterpriseAddressesQuerySchema = z.object({
  adressType: enterpriseAddressTypeSchema.optional(),
})

export type ListEnterpriseAddressesQuery = z.infer<
  typeof listEnterpriseAddressesQuerySchema
>

export const listEnterpriseAddressesResponseSchema = z.array(enterpriseAddressSchema)
