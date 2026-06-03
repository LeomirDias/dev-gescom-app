import { apiFetch } from "@/lib/api/client"
import { successEnvelopeSchema } from "@/lib/api/envelope"
import {
  financialInfoSchema,
  patchFinancialInfoRequestSchema,
  patchPersonalInfoRequestSchema,
  patchRelationshipsRequestSchema,
  patchTaxInfosRequestSchema,
  patchUserAddressRequestSchema,
  patchUserContactRequestSchema,
  personalInfoSchema,
  postFinancialInfoRequestSchema,
  postPersonalInfoRequestSchema,
  postRelationshipsRequestSchema,
  postTaxInfosRequestSchema,
  postUserAddressRequestSchema,
  postUserContactRequestSchema,
  relationshipsSchema,
  taxInfosSchema,
  userAddressSchema,
  userContactSchema,
  userDetailsResponseSchema,
  type PatchFinancialInfoRequest,
  type PatchPersonalInfoRequest,
  type PatchRelationshipsRequest,
  type PatchTaxInfosRequest,
  type PatchUserAddressRequest,
  type PatchUserContactRequest,
  type PostFinancialInfoRequest,
  type PostPersonalInfoRequest,
  type PostRelationshipsRequest,
  type PostTaxInfosRequest,
  type PostUserAddressRequest,
  type PostUserContactRequest,
} from "@/modules/users-onboarding/users-onboarding.schema"

function userOnboardingBase(enterpriseId: string, userId: string) {
  return `enterprises/${enterpriseId}/users/${userId}`
}

export async function getUserDetailsService(
  enterpriseId: string,
  userId: string
) {
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/details`,
    { method: "GET" }
  )
  return successEnvelopeSchema(userDetailsResponseSchema).parse(raw).data
}

export async function postPersonalInfoService(
  enterpriseId: string,
  userId: string,
  input: PostPersonalInfoRequest
) {
  const body = postPersonalInfoRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/personal-info`,
    { method: "POST", body }
  )
  return successEnvelopeSchema(personalInfoSchema).parse(raw).data
}

export async function patchPersonalInfoService(
  enterpriseId: string,
  userId: string,
  input: PatchPersonalInfoRequest
) {
  const body = patchPersonalInfoRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/personal-info`,
    { method: "PATCH", body }
  )
  return successEnvelopeSchema(personalInfoSchema).parse(raw).data
}

export async function postUserAddressService(
  enterpriseId: string,
  userId: string,
  input: PostUserAddressRequest
) {
  const body = postUserAddressRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/addresses`,
    { method: "POST", body }
  )
  return successEnvelopeSchema(userAddressSchema).parse(raw).data
}

export async function patchUserAddressService(
  enterpriseId: string,
  userId: string,
  addressId: string,
  input: PatchUserAddressRequest
) {
  const body = patchUserAddressRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/addresses/${addressId}`,
    { method: "PATCH", body }
  )
  return successEnvelopeSchema(userAddressSchema).parse(raw).data
}

export async function postUserContactService(
  enterpriseId: string,
  userId: string,
  input: PostUserContactRequest
) {
  const body = postUserContactRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/contacts`,
    { method: "POST", body }
  )
  return successEnvelopeSchema(userContactSchema).parse(raw).data
}

export async function patchUserContactService(
  enterpriseId: string,
  userId: string,
  contactId: string,
  input: PatchUserContactRequest
) {
  const body = patchUserContactRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/contacts/${contactId}`,
    { method: "PATCH", body }
  )
  return successEnvelopeSchema(userContactSchema).parse(raw).data
}

export async function postRelationshipsService(
  enterpriseId: string,
  userId: string,
  input: PostRelationshipsRequest
) {
  const body = postRelationshipsRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/relationships`,
    { method: "POST", body }
  )
  return successEnvelopeSchema(relationshipsSchema).parse(raw).data
}

export async function patchRelationshipsService(
  enterpriseId: string,
  userId: string,
  input: PatchRelationshipsRequest
) {
  const body = patchRelationshipsRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/relationships`,
    { method: "PATCH", body }
  )
  return successEnvelopeSchema(relationshipsSchema).parse(raw).data
}

export async function postTaxInfosService(
  enterpriseId: string,
  userId: string,
  input: PostTaxInfosRequest
) {
  const body = postTaxInfosRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/tax-infos`,
    { method: "POST", body }
  )
  return successEnvelopeSchema(taxInfosSchema).parse(raw).data
}

export async function patchTaxInfosService(
  enterpriseId: string,
  userId: string,
  input: PatchTaxInfosRequest
) {
  const body = patchTaxInfosRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/tax-infos`,
    { method: "PATCH", body }
  )
  return successEnvelopeSchema(taxInfosSchema).parse(raw).data
}

export async function postFinancialInfoService(
  enterpriseId: string,
  userId: string,
  input: PostFinancialInfoRequest
) {
  const body = postFinancialInfoRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/financial-info`,
    { method: "POST", body }
  )
  return successEnvelopeSchema(financialInfoSchema).parse(raw).data
}

export async function patchFinancialInfoService(
  enterpriseId: string,
  userId: string,
  input: PatchFinancialInfoRequest
) {
  const body = patchFinancialInfoRequestSchema.parse(input)
  const raw = await apiFetch<unknown>(
    `${userOnboardingBase(enterpriseId, userId)}/financial-info`,
    { method: "PATCH", body }
  )
  return successEnvelopeSchema(financialInfoSchema).parse(raw).data
}
