"use client"

import { Suspense, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { z } from "zod"
import { LoginRouteLoading } from "@/app/auth/login/_components/login-route-loading"
import { useAuth } from "@/components/providers/authentication/auth-store"
import { useMinLoadingDisplay } from "@/hooks/use-min-loading-display"
import { InvitationForm } from "./_components/invitation-form"

const memberIdSchema = z.uuid()

function InvitationPageContent() {
  const router = useRouter()
  const params = useParams()
  const { hydrated, isAuthenticated } = useAuth()

  const rawMemberId = typeof params.memberId === "string" ? params.memberId : ""
  const memberIdResult = memberIdSchema.safeParse(rawMemberId)
  const memberId = memberIdResult.success ? memberIdResult.data : null

  const showLoading = useMinLoadingDisplay(!hydrated)

  useEffect(() => {
    if (!hydrated) return
    if (!memberId) {
      router.replace("/auth/login")
    }
  }, [hydrated, memberId, router])

  if (showLoading || !hydrated || !memberId) {
    return <LoginRouteLoading />
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <InvitationForm
          memberId={memberId}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<LoginRouteLoading />}>
      <InvitationPageContent />
    </Suspense>
  )
}
