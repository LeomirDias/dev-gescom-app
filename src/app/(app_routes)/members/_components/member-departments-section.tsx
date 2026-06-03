"use client"

import { useState } from "react"
import { Building2, Pencil, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HttpError } from "@/lib/api/http-error"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import { ConfirmSoftDeleteDialog } from "@/components/global/confirm-soft-delete-dialog"
import { MemberDepartmentForm } from "@/app/(app_routes)/members/_components/member-department-form"
import { MemberStatusBadge } from "@/app/(app_routes)/members/_components/member-status-badge"
import type { MemberDepartment, MemberDetail } from "@/modules/memberships/memberships.schema"
import { useUpdateMemberDepartmentMutation } from "@/modules/memberships/use-members"

export function MemberDepartmentsSection({
  enterpriseId,
  member,
  canAlter,
  departmentNameById,
}: {
  enterpriseId: string
  member: MemberDetail
  canAlter: boolean
  departmentNameById: Map<string, string>
}) {
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<MemberDepartment | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<MemberDepartment | null>(
    null
  )
  const deleteMutation = useUpdateMemberDepartmentMutation(
    enterpriseId,
    member.id
  )

  const activeDepartments = member.departments.filter(
    (d) => d.status === "ATIVO"
  )
  const existingIds = member.departments.map((d) => d.departmentId)

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync({
        memberDepartmentId: deleteTarget.id,
        input: { softDelete: true },
      })
      setDeleteTarget(null)
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Nao foi possivel remover o departamento.")
        return
      }
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-4 text-primary" aria-hidden />
            <CardTitle className="text-md">Departamentos</CardTitle>
          </CardTitle>
        </div>
        {canAlter && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
            tooltip="Adicionar departamento"
          >
            <Plus className="size-4" aria-hidden />
            Adicionar
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {activeDepartments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum departamento ativo.
          </p>
        ) : (
          activeDepartments.map((d) => {
            const name =
              departmentNameById.get(d.departmentId) ?? d.departmentId
            return (
              <div
                key={d.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium">{name}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    memberDepartmentId: {d.id}
                  </p>
                  {d.mainDepartment && (
                    <span className="mt-1 inline-block text-xs font-medium text-primary">
                      Principal
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MemberStatusBadge status={d.status} />
                  {canAlter && (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditing(d)
                          setFormOpen(true)
                        }}
                        tooltip="Editar departamento"
                        aria-label="Editar departamento"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(d)}
                        tooltip="Remover departamento"
                        aria-label="Remover departamento"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </CardContent>

      {canAlter && (
        <MemberDepartmentForm
          open={formOpen}
          onOpenChange={setFormOpen}
          enterpriseId={enterpriseId}
          memberId={member.id}
          existingDepartmentIds={existingIds}
          editing={editing}
        />
      )}

      <ConfirmSoftDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Remover departamento?"
        description="O vinculo sera inactivado e permissoes associadas removidas."
        confirmLabel="Remover"
        isPending={deleteMutation.isPending}
        onConfirm={() => void confirmDelete()}
      />
    </Card>
  )
}
