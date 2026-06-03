"use client"

import { Suspense } from "react"
import { FirstAccessVerifyForm } from "@/app/auth/first-access/_components/first-access-verify-form"
import { FirstAccessRouteLoading } from "@/app/auth/first-access/_components/first-access-route-loading"

function VerifyContent() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <FirstAccessVerifyForm />
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<FirstAccessRouteLoading />}>
      <VerifyContent />
    </Suspense>
  )
}
