import { apiFetch } from "@/lib/api/client"
import { successEnvelopeSchema } from "@/lib/api/envelope"
import {
  listCepsResponseSchema,
  listCitiesResponseSchema,
  listCountriesResponseSchema,
  listStatesResponseSchema,
} from "@/modules/addresses/addresses.schema"

export async function listCountriesService() {
  const raw = await apiFetch<unknown>("addresses/countries", { method: "GET" })
  const envelope = successEnvelopeSchema(listCountriesResponseSchema).parse(raw)
  return envelope.data
}

export async function listStatesService(countryId: string) {
  const params = new URLSearchParams({ countryId })
  const raw = await apiFetch<unknown>(
    `addresses/states?${params.toString()}`,
    { method: "GET" }
  )
  const envelope = successEnvelopeSchema(listStatesResponseSchema).parse(raw)
  return envelope.data
}

export async function listCitiesService(stateId: string) {
  const params = new URLSearchParams({ stateId })
  const raw = await apiFetch<unknown>(
    `addresses/cities?${params.toString()}`,
    { method: "GET" }
  )
  const envelope = successEnvelopeSchema(listCitiesResponseSchema).parse(raw)
  return envelope.data
}

export async function listCepsService(cityId: string, cepNumber?: string) {
  const params = new URLSearchParams({ cityId })
  const digits = cepNumber?.replace(/\D/g, "") ?? ""
  if (digits.length > 0 && digits.length !== 8) {
    throw new Error("CEP deve conter exatamente 8 digitos.")
  }
  if (digits.length === 8) params.set("cepNumber", digits)
  const raw = await apiFetch<unknown>(
    `addresses/ceps?${params.toString()}`,
    { method: "GET" }
  )
  const envelope = successEnvelopeSchema(listCepsResponseSchema).parse(raw)
  return envelope.data
}
