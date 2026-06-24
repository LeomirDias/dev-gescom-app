"use client"

import { Mail, Phone } from "lucide-react"

import {
  MemberSheetItem,
  MemberSheetSection,
} from "@/app/(app_routes)/members/_components/member-sheet-parts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatPhone } from "@/lib/formatters"
import { getUserInitials } from "@/lib/user-initials"
import type { User } from "@/modules/users/users.schema"

type UserProfileSummaryProps = {
  user: User
}

export function UserProfileSummary({ user }: UserProfileSummaryProps) {
  const displayName = user.userName.trim()
  const initials = getUserInitials(displayName)
  const email = user.userEmail?.trim()
  const phone = formatPhone(user.userPhone)

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Avatar
          size="default"
          className="size-20 shrink-0 ring-2 ring-primary shadow-md after:border-0 sm:size-24"
        >
          <AvatarFallback className="bg-transparent text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="text-primary">{initials}</span>
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 space-y-3">
          <h2 className="font-heading text-xl font-semibold leading-tight sm:text-2xl">
            {displayName}
          </h2>
          <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="inline-flex min-w-0 items-center gap-2 text-foreground underline-offset-4 transition-all duration-300 hover:scale-105 hover:cursor-pointer"
              >
                <Mail className="size-3.5 shrink-0 text-primary" aria-hidden />
                <span className="truncate">{email}</span>
              </a>
            ) : null}
            <a
              href={`tel:${user.userPhone}`}
              className="inline-flex min-w-0 items-center gap-2 text-foreground underline-offset-4 transition-all duration-300 hover:scale-105 hover:cursor-pointer"
            >
              <Phone className="size-3.5 shrink-0 text-primary" aria-hidden />
              <span className="truncate">{phone}</span>
            </a>
          </div>
        </div>
      </header>

      <MemberSheetSection
        title="Dados cadastrais"
        description="Informações de identificação do usuário"
      >
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <MemberSheetItem label="Nome completo" value={user.userName} />
          <MemberSheetItem label="E-mail" value={user.userEmail} />
          <MemberSheetItem label="Telefone" value={phone} />
        </dl>
      </MemberSheetSection>
    </div>
  )
}
