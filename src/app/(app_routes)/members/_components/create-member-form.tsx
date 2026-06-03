"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HttpError } from "@/lib/api/http-error"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import { MemberDepartmentsPicker } from "@/app/(app_routes)/members/_components/member-departments-picker"
import { MEMBERS_BASE_PATH } from "@/app/(app_routes)/members/_components/members-constants"
import { MEMBER_CLASS_OPTIONS } from "@/modules/memberships/member-class-label"
import type { EnterpriseMemberClass } from "@/modules/memberships/memberships.schema"
import type { MemberDepartmentPayload } from "@/modules/memberships/memberships.schema"
import {
  isClienteClass,
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
  validateDepartmentsPayload,
} from "@/modules/memberships/memberships-rules"
import { useCreateMemberWithUserMutation } from "@/modules/memberships/use-members"
import { Separator } from "@/components/ui/separator"

export function CreateMemberForm({
  enterpriseId,
}: {
  enterpriseId: string
}) {
  const router = useRouter()
  const mutation = useCreateMemberWithUserMutation(enterpriseId)
  const [memberClass, setMemberClass] =
    useState<EnterpriseMemberClass>("COLABORADOR")
  const [departments, setDepartments] = useState<MemberDepartmentPayload[]>([])

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
      toast.error("Preencha todos os campos do utilizador.")
      return
    }

    const deptValidation = validateDepartmentsPayload(memberClass, departments)
    if (!deptValidation.ok) {
      toast.error(deptValidation.message)
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
          class: memberClass,
          departments: isClienteClass(memberClass) ? [] : departments,
        },
      })
      if (!isClienteClass(memberClass)) {
        toast.info(
          "O utilizador recebera um e-mail de primeiro acesso para concluir o cadastro."
        )
      }
      router.push(`${MEMBERS_BASE_PATH}/${result.member.id}`)
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Nao foi possivel criar o membro.")
        return
      }
      toast.error("Nao foi possivel criar o membro.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Novo membro</CardTitle>
        <CardDescription>
          Crie um novo membro e vincule-o à empresa.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Ao relacionar um usuário existente, o usuário receberá um e-mail de primeiro acesso para concluir o cadastro de acesso ao sistema.
        </p>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <Input id="userName" name="userName" placeholder="Informe o nome" required />
              </Field>
              <Field>
                <Input id="userRegistration" name="userRegistration" placeholder="Informe o CPF/CNPJ" required />
              </Field>
              <Field>
                <Input
                  id="userEmail"
                  name="userEmail"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Informe o e-mail"
                />
              </Field>
              <Field>
                <Input id="userPhone" name="userPhone" required placeholder="Informe o telefone" />
              </Field>
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
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
              tooltip="Criar membro"
            >
              {mutation.isPending ? "A criar..." : "Criar membro"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
