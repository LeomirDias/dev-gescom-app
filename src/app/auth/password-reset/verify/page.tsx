"use client"

import { Suspense } from "react"
import { PasswordResetVerifyForm } from "@/app/auth/password-reset/_components/password-reset-verify-form"
import { PasswordResetRouteLoading } from "@/app/auth/password-reset/_components/password-reset-route-loading"

function VerifyContent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <PasswordResetVerifyForm />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<PasswordResetRouteLoading />}>
      <VerifyContent />
    </Suspense>
  )
}
