"use client"

import { FirstAccessForm } from "@/app/auth/first-access/_components/first-access-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <FirstAccessForm />
      </div>
    </div>
  )
}
