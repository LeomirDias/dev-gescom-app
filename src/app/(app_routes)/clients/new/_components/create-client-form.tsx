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
  normalizeRegistration,
} from "@/modules/memberships/memberships-rules"
import { useCreateMemberWithUserMutation } from "@/modules/memberships/use-members"

const USER_FIELDS: PageFormField[] = [
  {
    id: "userName",
    name: "userName",
    placeholder: "Informe o nome",
    required: true,
    className: "sm:col-span-2",
  },
  {
    id: "userRegistration",
    name: "userRegistration",
    placeholder: "Informe o CPF/CNPJ",
    required: true,
  },
  {
    id: "userEmail",
    name: "userEmail",
    type: "email",
    autoComplete: "email",
    placeholder: "Informe o e-mail",
    required: true,
  },
  {
    id: "userPhone",
    name: "userPhone",
    placeholder: "Informe o telefone",
    required: true,
  },
]

export function CreateClientForm({
  enterpriseId,
  class: fixedClass,
  title = "Novo cliente",
  subtitle = "Crie um novo cliente com um novo usuário",
  submitLabel = "Criar cliente",
  pendingLabel = "Criando cliente...",
}: {
  enterpriseId: string
  class?: EnterpriseMemberClass
  title?: string
  subtitle?: string
  submitLabel?: string
  pendingLabel?: string
}) {
  const router = useRouter()
  const mutation = useCreateMemberWithUserMutation(enterpriseId)
  const [memberClass, setMemberClass] = useState<EnterpriseMemberClass>(
    fixedClass ?? "CLIENTE"
  )
  const [departments, setDepartments] = useState<MemberDepartmentPayload[]>([])
  const effectiveClass = fixedClass ?? memberClass

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const userName = (
      form.elements.namedItem("userName") as HTMLInputElement
    ).value.trim()
    const userRegistration = normalizeRegistration(
      (form.elements.namedItem("userRegistration") as HTMLInputElement).value
    )
    const userEmail = normalizeEmail(
      (form.elements.namedItem("userEmail") as HTMLInputElement).value
    )
    const userPhone = normalizePhone(
      (form.elements.namedItem("userPhone") as HTMLInputElement).value
    )
    if (!userName || !userRegistration || !userEmail || !userPhone) {
      toast.error("Preencha todos os campos do cliente.")
      return
    }

    try {
      const result = await mutation.mutateAsync({
        user: {
          userName,
          userRegistration,
          userEmail,
          userPhone,
        },
        member: {
          class: effectiveClass,
          departments: isClienteClass(effectiveClass) ? [] : departments,
        },
      })
      router.push(`/members/${result.member.id}`)
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  return (
    <PageFormCard
      title={title}
      subtitle={subtitle}
      fields={USER_FIELDS}
      onSubmit={handleSubmit}
      submitLabel={submitLabel}
      pendingLabel={pendingLabel}
      isPending={mutation.isPending}
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
          <Field className="sm:col-span-2">
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
