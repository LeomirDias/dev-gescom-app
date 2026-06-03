"use client"

import { PasswordResetForm } from "@/app/auth/password-reset/_components/password-reset-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <PasswordResetForm />
      </div>
    </div>
  )
}
