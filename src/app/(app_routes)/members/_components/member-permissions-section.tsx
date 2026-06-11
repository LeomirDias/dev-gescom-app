"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
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
import type { MemberDepartment } from "@/modules/memberships/memberships.schema"
import {
  useUpdateMemberExtraPermissionMutation,
  useUpdateMemberPermissionDefaultMutation,
} from "@/modules/memberships/use-members"
import { CheckCircle } from "lucide-react"

type MemberPermissionsSectionProps = {
  enterpriseId: string
  memberId: string
  departments: MemberDepartment[]
  departmentNameById: Map<string, string>
  canAlterPermissions: boolean
}

export function MemberPermissionsSection({
  enterpriseId,
  memberId,
  departments,
  departmentNameById,
  canAlterPermissions,
}: MemberPermissionsSectionProps) {
  const active = departments.filter((d) => d.status === "ATIVO")
  const [selectedDeptId, setSelectedDeptId] = useState(
    active[0]?.departmentId ?? ""
  )
  const defaultMutation = useUpdateMemberPermissionDefaultMutation(
    enterpriseId,
    memberId
  )
  const extraMutation = useUpdateMemberExtraPermissionMutation(
    enterpriseId,
    memberId
  )

  if (!canAlterPermissions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permissões</CardTitle>
          <CardDescription>
            Sem permissão alterar_permissoes para editar.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (active.length === 0) {
    return (
      <Card>
        <CardHeader className="flex items-center gap-2">
          <CheckCircle className="size-4 text-primary" aria-hidden />
          <CardTitle className="text-md">Permissões</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  async function submitPermission(
    kind: "default" | "extra",
    form: HTMLFormElement,
    softDelete: boolean
  ) {
    if (!selectedDeptId) {
      toast.error("Selecione um departamento.")
      return
    }
    const permission = (
      form.elements.namedItem("permission") as HTMLInputElement
    ).value.trim()
    if (!permission) {
      toast.error("Informe o código da permissão.")
      return
    }

    const status = (
      form.elements.namedItem("permStatus") as HTMLInputElement | null
    )?.value as "ALLOW" | "DENIED" | undefined
    if (!softDelete && !status) {
      toast.error("Selecione permitir ou negar.")
      return
    }

    try {
      const input = softDelete
        ? { permission, softDelete: true as const }
        : { permission, status }

      if (kind === "default") {
        await defaultMutation.mutateAsync({
          departmentId: selectedDeptId,
          input,
        })
      } else {
        await extraMutation.mutateAsync({
          departmentId: selectedDeptId,
          input,
        })
      }
      form.reset()
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível atualizar a permissão.")
        return
      }
      toast.error("Não foi possível atualizar a permissão.")
    }
  }

  const isPending = defaultMutation.isPending || extraMutation.isPending

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissões</CardTitle>
        <CardDescription>
          Edição pontual por código (PATCH permissions-default / extra-permissions).
          A API usa departmentId na URL.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Field>
          <FieldLabel>Departamento</FieldLabel>
          <Select value={selectedDeptId} onValueChange={setSelectedDeptId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {active.map((d) => (
                <SelectItem key={d.departmentId} value={d.departmentId}>
                  {departmentNameById.get(d.departmentId) ?? d.departmentId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <PermissionFormBlock
          title="Permissão padrão"
          formId="perm-default"
          isPending={isPending}
          onSubmit={(form, soft) => void submitPermission("default", form, soft)}
        />
        <PermissionFormBlock
          title="Permissão extra"
          formId="perm-extra"
          isPending={isPending}
          onSubmit={(form, soft) => void submitPermission("extra", form, soft)}
        />
      </CardContent>
    </Card>
  )
}

function PermissionFormBlock({
  title,
  formId,
  isPending,
  onSubmit,
}: {
  title: string
  formId: string
  isPending: boolean
  onSubmit: (form: HTMLFormElement, softDelete: boolean) => void
}) {
  const [permStatus, setPermStatus] = useState<"ALLOW" | "DENIED">("ALLOW")

  return (
    <div className="rounded-lg border border-border/60 p-4">
      <h3 className="text-sm font-semibold">{title}</h3>
      <form
        id={formId}
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(e.currentTarget, false)
        }}
      >
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor={`${formId}-permission`}>Codigo</FieldLabel>
            <Input
              id={`${formId}-permission`}
              name="permission"
              placeholder="ex.: consultar_membros"
              className="font-mono text-sm"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`${formId}-status`}>Status</FieldLabel>
            <input type="hidden" name="permStatus" value={permStatus} />
            <Select
              value={permStatus}
              onValueChange={(v) => setPermStatus(v as "ALLOW" | "DENIED")}
            >
              <SelectTrigger id={`${formId}-status`} className="w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALLOW">ALLOW</SelectItem>
                <SelectItem value="DENIED">DENIED</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              tooltip="Aplicar permissão"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                const form = document.getElementById(formId)
                if (form instanceof HTMLFormElement) {
                  onSubmit(form, true)
                }
              }}
              tooltip="Remover permissão"
            >
              Remover
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
