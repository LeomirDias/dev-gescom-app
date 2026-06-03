"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/providers/authentication/auth-store"

export function useRequireEnterprise() {
  const router = useRouter()
  const { hydrated, activeEnterprise } = useAuth()
  const enterpriseId = activeEnterprise?.id

  useEffect(() => {
    if (hydrated && !enterpriseId) {
      router.replace("/auth/select-enterprise")
    }
  }, [hydrated, enterpriseId, router])

  return {
    hydrated,
    enterpriseId,
    activeEnterprise,
    ready: hydrated && Boolean(enterpriseId),
  }
}
