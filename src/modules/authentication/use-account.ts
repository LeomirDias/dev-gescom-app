"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/components/providers/authentication/auth-store"
import { fetchAuthMe, meUserToAuthUser } from "@/modules/authentication/auth.service"
import type { MeResponse } from "@/modules/authentication/auth.schema"

function useMeQueryEnabled() {
  const { hydrated, isAuthenticated } = useAuth()
  return {
    enabled: hydrated && isAuthenticated,
  }
}

/** Resposta completa de `GET /auth/me` (utilizador, empresa do token, permissões). */
export function useMeQuery() {
  const { enabled } = useMeQueryEnabled()
  return useQuery({
    queryKey: ["account", "me"],
    queryFn: async (): Promise<MeResponse> => fetchAuthMe(),
    enabled,
    staleTime: 0,
  })
}

/** Resposta simplificada de `GET /auth/me` (utilizador). */
export function useAccountProfileQuery() {
  const { enabled } = useMeQueryEnabled()
  return useQuery({
    queryKey: ["account", "me"],
    queryFn: async () => fetchAuthMe(),
    enabled,
    staleTime: 0,
    select: (me) => meUserToAuthUser(me.user),
  })
}
