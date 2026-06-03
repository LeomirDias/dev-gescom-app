"use client"

import { useState } from "react"
import { Globe, MapPin, Plus, Trash2 } from "lucide-react"

import { ConfirmSoftDeleteDialog } from "@/components/global/confirm-soft-delete-dialog"
import { ProfileEditActions, ProfileField } from "@/app/(app_routes)/profile/_components/profile-field"
import { UserOnboardingEmpty } from "@/app/(app_routes)/profile/_components/onboarding/user-onboarding-empty"
import { UserAddressForm } from "@/app/(app_routes)/profile/_components/onboarding/user-address-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HttpError } from "@/lib/api/http-error"
import { useResolveAddressDisplay } from "@/modules/addresses/use-resolve-address-display"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import { getUserAddressTypeLabel } from "@/modules/users-onboarding/users-onboarding-labels"
import type { UserAddress } from "@/modules/users-onboarding/users-onboarding.schema"
import { usePatchUserAddressMutation } from "@/modules/users-onboarding/use-users-onboarding"

export function UserAddressesSection({
  enterpriseId,
  userId,
  memberId,
  addresses,
  canAlter,
}: {
  enterpriseId: string
  userId: string
  memberId?: string
  addresses: UserAddress[]
  canAlter: boolean
}) {
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<"create" | "edit">("create")
  const [editing, setEditing] = useState<UserAddress | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserAddress | null>(null)

  const { getDisplay, isLoading } = useResolveAddressDisplay(
    addresses,
    addresses.length > 0
  )
  const patchMutation = usePatchUserAddressMutation(
    enterpriseId,
    userId,
    memberId
  )

  function openCreate() {
    setFormMode("create")
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(address: UserAddress) {
    setFormMode("edit")
    setEditing(address)
    setFormOpen(true)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await patchMutation.mutateAsync({
        addressId: deleteTarget.id,
        input: { softDelete: true },
      })
      setDeleteTarget(null)
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível remover o endereço.")
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="size-5 text-primary text-base" aria-hidden />
          Endereços
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {addresses.length === 0 ? (
          <UserOnboardingEmpty
            title="Sem endereços cadastrados."
            description="Adicione um endereço com país, estado, cidade e CEP."
          />
        ) : (
          <ul className="space-y-4">
            {addresses.map((address) => {
              const display = getDisplay(address)
              const loadingLabel = isLoading ? "A carregar..." : null

              return (
                <li
                  key={address.id}
                  className="space-y-4 rounded-lg border border-border/60 bg-muted/15 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      {getUserAddressTypeLabel(address.adressType)}
                    </p>
                    {canAlter && (
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setDeleteTarget(address)}
                        aria-label="Remover endereço"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ProfileField
                      label="País"
                      value={loadingLabel ?? display.countryName}
                      icon={Globe}
                    />
                    <ProfileField
                      label="Estado"
                      value={loadingLabel ?? display.stateLabel}
                      icon={MapPin}
                    />
                    <ProfileField
                      label="Cidade"
                      value={loadingLabel ?? display.cityName}
                      icon={MapPin}
                    />
                    <ProfileField
                      label="CEP / Logradouro"
                      value={loadingLabel ?? display.cepSummary}
                      icon={MapPin}
                      className="sm:col-span-2"
                    />
                  </div>
                  {canAlter && (
                    <ProfileEditActions
                      editing={false}
                      canEdit
                      onStartEdit={() => openEdit(address)}
                      onCancel={() => undefined}
                      onSave={() => undefined}
                      editLabel="Editar endereço"
                    />
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {canAlter && addresses.length > 0 && (
          <div className="flex w-full">
            <Button
              type="button"
              variant="outline"
              onClick={openCreate}
              className="w-full"
            >
              <Plus className="size-4" aria-hidden />
              Adicionar endereço
            </Button>
          </div>
        )}

        {canAlter && addresses.length === 0 && (
          <ProfileEditActions
            editing={false}
            canEdit
            onStartEdit={openCreate}
            onCancel={() => undefined}
            onSave={() => undefined}
            addLabel="Adicionar endereço"
            isEmpty
          />
        )}
      </CardContent>

      {canAlter && (
        <>
          <UserAddressForm
            open={formOpen}
            onOpenChange={setFormOpen}
            enterpriseId={enterpriseId}
            userId={userId}
            memberId={memberId}
            mode={formMode}
            editing={editing}
          />
          <ConfirmSoftDeleteDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Remover endereço?"
            description="O endereço será removido logicamente."
            confirmLabel="Remover"
            isPending={patchMutation.isPending}
            onConfirm={() => void confirmDelete()}
          />
        </>
      )}
    </Card>
  )
}
