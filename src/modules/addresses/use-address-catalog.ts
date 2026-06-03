"use client"

import { useQuery } from "@tanstack/react-query"
import {
  listCepsService,
  listCitiesService,
  listCountriesService,
  listStatesService,
} from "@/modules/addresses/addresses.service"

export const addressCountriesQueryKey = ["addresses", "countries"] as const

export const addressStatesQueryKey = (countryId: string) =>
  ["addresses", "states", countryId] as const

export const addressCitiesQueryKey = (stateId: string) =>
  ["addresses", "cities", stateId] as const

export const addressCepsQueryKey = (cityId: string, cepNumber?: string) => {
  const digits = cepNumber?.replace(/\D/g, "") ?? ""
  return ["addresses", "ceps", cityId, digits] as const
}

export function useCountriesQuery(enabled = true) {
  return useQuery({
    queryKey: addressCountriesQueryKey,
    queryFn: () => listCountriesService(),
    enabled,
    staleTime: 60_000,
  })
}

export function useStatesQuery(countryId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: addressStatesQueryKey(countryId ?? ""),
    queryFn: () => listStatesService(countryId!),
    enabled: enabled && Boolean(countryId),
    staleTime: 60_000,
  })
}

export function useCitiesQuery(stateId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: addressCitiesQueryKey(stateId ?? ""),
    queryFn: () => listCitiesService(stateId!),
    enabled: enabled && Boolean(stateId),
    staleTime: 60_000,
  })
}

export function useCepsQuery(
  cityId: string | undefined,
  cepNumber?: string,
  enabled = true
) {
  const digits = cepNumber?.replace(/\D/g, "") ?? ""
  return useQuery({
    queryKey: addressCepsQueryKey(cityId ?? "", digits || undefined),
    queryFn: () => listCepsService(cityId!, digits || undefined),
    enabled:
      enabled && Boolean(cityId) && (!digits || digits.length === 8),
    staleTime: 30_000,
  })
}
