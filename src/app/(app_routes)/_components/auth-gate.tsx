"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { AppRoutesLoading } from "@/app/(app_routes)/_components/app-routes-loading"
import { useAuth } from "@/components/providers/authentication/auth-store"
import { useMinLoadingDisplay } from "@/hooks/use-min-loading-display"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { hydrated, isAuthenticated } = useAuth()
  const router = useRouter()
  const showLoading = useMinLoadingDisplay(!hydrated)

  useEffect(() => {
    if (!hydrated) return
    if (!isAuthenticated) {
      router.replace("/auth/login")
    }
  }, [hydrated, isAuthenticated, router])

  if (showLoading) {
    return <AppRoutesLoading />
  }

  if (!isAuthenticated) {
    return null
  }

  return children
}
