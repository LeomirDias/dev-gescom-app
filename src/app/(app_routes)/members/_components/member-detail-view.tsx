"use client"

import {
  Mail,
  Phone,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/global/returns/status-badge"
import { formatCpfCnpj, formatDateOnly, formatPhone } from "@/lib/formatters"
import { getUserInitials } from "@/lib/user-initials"
import { cn } from "@/lib/utils"
import { getMemberClassLabel } from "@/modules/memberships/member-class-label"
import type {
  MemberDetail,
  MemberStatus,
  MemberUserSummary,
} from "@/modules/memberships/memberships.schema"
import { useMembersQuery } from "@/modules/memberships/use-members"
import { useUserQuery } from "@/modules/users/use-users"
import { MemberClassBadge } from "./member-class-badge"

type MemberDetailViewProps = {
  member: MemberDetail
  enterpriseId: string
}

function formatDisplayValue(
  value: string | null | undefined | number
): string {
  if (value === null || value === undefined || value === "") return "—"
  return String(value)
}

function formatMemberStatus(status: MemberStatus): string {
  return status === "ATIVO" ? "Ativo" : "Inativo"
}

function MemberSheetItem({
  label,
  value,
  className,
  children,
}: {
  label: string
  value?: string | null
  className?: string
  children?: React.ReactNode
}) {
  const display = formatDisplayValue(value)
  const empty = display === "—" && !children

  return (
    <div className={cn("min-w-0 space-y-1", className)}>
      <dt className="flex items-center gap-1 text-sm font-medium text-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "text-sm font-normal text-muted-foreground",
          empty && "text-muted-foreground"
        )}
      >
        {children ?? display}
      </dd>
    </div>
  )
}

function MemberSheetSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function MemberDetailProfileHeader({ member }: { member: MemberDetail }) {
  const displayName = member.user.userName.trim()
  const initials = getUserInitials(displayName)
  const email = member.user.userEmail?.trim()
  const phone = formatPhone(member.user.userPhone)
  const hasContact = Boolean(email) || phone !== "—"

  return (
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
        <div className="space-y-2">
          <h1 className="font-heading text-xl font-semibold leading-tight sm:text-2xl flex items-baseline gap-1">
            {displayName}
            <span className="flex items-center gap-1">  {member.code != null ? (
              <span className="font-mono font-normal text-xs tabular-nums text-primary">
                Cód. {member.code}
              </span>
            ) : null}
            </span>
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={member.status} />
            <MemberClassBadge memberClass={member.class} />
          </div>
        </div>

        {hasContact ? (
          <div className="flex flex-col gap-1.5 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="inline-flex min-w-0 items-center gap-2 text-foreground underline-offset-4 hover:cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <Mail className="size-3.5 shrink-0 text-primary" aria-hidden />
                <span className="truncate">{email}</span>
              </a>
            ) : null}
            {phone !== "—" ? (
              <a
                href={`tel:${member.user.userPhone}`}
                className="inline-flex min-w-0 items-center gap-2 text-foreground underline-offset-4 hover:cursor-pointer hover:scale-105 transition-all duration-300"
              >
                <Phone className="size-3.5 shrink-0 text-primary" aria-hidden />
                <span className="truncate">{phone}</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </header>
  )
}

function MemberDetailUserSection({ user }: { user: MemberUserSummary }) {
  return (
    <MemberSheetSection
      title="Dados cadastrais"
      description="Informações de identificação do usuário"
    >
      <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <MemberSheetItem
          label="Nome completo"
          value={user.userName}
        />
        <MemberSheetItem
          label="CPF/CNPJ"
          value={formatCpfCnpj(user.userRegistration)}
        />
        <MemberSheetItem
          label="E-mail"
          value={user.userEmail}
        />
        <MemberSheetItem
          label="Telefone"
          value={formatPhone(user.userPhone)}
        />
      </dl>
    </MemberSheetSection>
  )
}

function MemberDetailLinkSection({
  member,
  enterpriseId,
}: {
  member: MemberDetail
  enterpriseId: string
}) {
  const {
    data: includedByMembers,
    isPending: includedByListPending,
    isFetched: includedByListFetched,
  } = useMembersQuery({
    enterpriseId,
    filters: { userId: member.includedBy, limit: 1 },
    enabled: Boolean(enterpriseId) && Boolean(member.includedBy),
  })

  const includedByNameFromList = includedByMembers?.items[0]?.user.userName

  const { data: includedByUser, isPending: includedByUserPending } =
    useUserQuery({
      enterpriseId,
      userId: member.includedBy,
      enabled:
        Boolean(enterpriseId) &&
        Boolean(member.includedBy) &&
        includedByListFetched &&
        !includedByNameFromList,
      retry: false,
    })

  const includedByDisplay =
    includedByNameFromList ?? includedByUser?.userName
  const includedByPending =
    includedByListPending ||
    (includedByListFetched && !includedByNameFromList && includedByUserPending)

  return (
    <MemberSheetSection
      title="Vínculo"
      description="Situação e histórico do membro na empresa"
    >
      <dl className="w-full grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <MemberSheetItem
          label="Classe"
          value={getMemberClassLabel(member.class)}
        />
        <MemberSheetItem
          label="Status"
          value={formatMemberStatus(member.status)}
        />
        <MemberSheetItem
          label="Código"
          value={member.code != null ? String(member.code) : null}
        />
        <MemberSheetItem
          label="Incluído por"
        >
          {includedByPending ? "…" : formatDisplayValue(includedByDisplay)}
        </MemberSheetItem>
        <MemberSheetItem
          label="Registrado em"
          value={formatDateOnly(member.registeredOn)}
        />
        <MemberSheetItem
          label="Aprovado em"
          value={formatDateOnly(member.approvedAt)}
        />

      </dl>
    </MemberSheetSection>
  )
}

export function MemberDetailView({
  member,
  enterpriseId,
}: MemberDetailViewProps) {
  return (
    <article className="overflow-hidden w-full h-full">
      <div className="flex flex-col items-start justify-between gap-6 p-4">
        <MemberDetailProfileHeader member={member} />

        <Separator />

        <MemberDetailUserSection user={member.user} />

        <Separator />

        <MemberDetailLinkSection
          member={member}
          enterpriseId={enterpriseId}
        />
      </div>
    </article>
  )
}
