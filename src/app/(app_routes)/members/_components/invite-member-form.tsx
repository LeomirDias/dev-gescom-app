"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Field } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MemberDepartmentsPicker } from "@/app/(app_routes)/members/[memberId]/_components/member-departments-picker"
import {
  PageFormCard,
  type PageFormField,
} from "@/components/global/forms/page-form-card"
import { MEMBER_CLASS_OPTIONS } from "@/modules/memberships/member-class-label"
import type { EnterpriseMemberClass } from "@/modules/memberships/memberships.schema"
import type { MemberDepartmentPayload } from "@/modules/memberships/memberships.schema"
import {
  isClienteClass,
  normalizeEmail,
  normalizePhone,
  validateDepartmentsPayload,
} from "@/modules/memberships/memberships-rules"
import { useInviteMemberMutation } from "@/modules/memberships/use-members"
import { phoneE164Schema } from "@/lib/validation/phone"

const INVITE_FIELDS: PageFormField[] = [
  {
    id: "inviteEmail",
    name: "inviteEmail",
    type: "email",
    autoComplete: "email",
    placeholder: "Informe o e-mail",
  },
  {
    id: "invitePhone",
    name: "invitePhone",
    placeholder: "Informe o telefone",
  },
]

export function InviteMemberForm({
  enterpriseId,
  class: fixedClass,
  title = "Convite de membro",
  subtitle = "Envie um convite para um novo membro",
  submitLabel = "Enviar convite",
  pendingLabel = "Enviando convite...",
  onSuccess,
}: {
  enterpriseId: string
  class?: EnterpriseMemberClass
  title?: string
  subtitle?: string
  submitLabel?: string
  pendingLabel?: string
  onSuccess?: (memberId: string) => void
}) {
  const router = useRouter()
  const mutation = useInviteMemberMutation(enterpriseId)
  const [memberClass, setMemberClass] = useState<EnterpriseMemberClass>(
    fixedClass ?? "COLABORADOR"
  )
  const [departments, setDepartments] = useState<MemberDepartmentPayload[]>([])
  const effectiveClass = fixedClass ?? memberClass

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const inviteEmailRaw = (
      form.elements.namedItem("inviteEmail") as HTMLInputElement
    ).value
    const invitePhoneRaw = (
      form.elements.namedItem("invitePhone") as HTMLInputElement
    ).value
    const inviteEmail = inviteEmailRaw
      ? normalizeEmail(inviteEmailRaw)
      : undefined
    const invitePhone = invitePhoneRaw
      ? normalizePhone(invitePhoneRaw)
      : undefined
    if (!inviteEmail && !invitePhone) {
      toast.error("Informe o e-mail ou o telefone.")
      return
    }

    let normalizedPhone: string | undefined
    if (invitePhone) {
      const phoneParsed = phoneE164Schema.safeParse(invitePhone)
      if (!phoneParsed.success) {
        toast.error("Telefone inválido. Use formato +5511999999999.")
        return
      }
      normalizedPhone = phoneParsed.data
    }

    const deptValidation = validateDepartmentsPayload(effectiveClass, departments)
    if (!deptValidation.ok) {
      toast.error(deptValidation.message)
      return
    }

    try {
      const result = await mutation.mutateAsync({
        member: {
          class: effectiveClass,
          departments: isClienteClass(effectiveClass) ? [] : departments,
        },
        inviteEmail,
        invitePhone: normalizedPhone,
      })
      if (onSuccess) {
        onSuccess(result.memberId)
      } else {
        router.push(`/members/${result.memberId}`)
      }
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <PageFormCard
      variant="sheet"
      title={title}
      subtitle={subtitle}
      fields={INVITE_FIELDS}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      pendingLabel={pendingLabel}
      isPending={mutation.isPending}
      cardClassName="h-full"
    >
      {!fixedClass ? (
        <>
          <Field>
            <Select
              value={memberClass}
              onValueChange={(v) => {
                const next = v as EnterpriseMemberClass
                setMemberClass(next)
                if (isClienteClass(next)) setDepartments([])
              }}
            >
              <SelectTrigger id="memberClass" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEMBER_CLASS_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <MemberDepartmentsPicker
              memberClass={memberClass}
              departments={departments}
              onChange={setDepartments}
            />
          </Field>
        </>
      ) : null}
    </PageFormCard>
  )
}
