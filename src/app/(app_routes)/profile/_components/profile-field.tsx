"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  BadgeCheck,
  Mail,
  Pencil,
  Phone,
  User,
  UserRound,
  X,
} from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCpfCnpj, formatPhone } from "@/lib/formatters"
import { getUserInitials } from "@/lib/user-initials"
import { cn } from "@/lib/utils"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { phoneE164Schema } from "@/lib/validation/phone"
import type { MeResponse } from "@/modules/authentication/auth.schema"
import {
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
} from "@/modules/memberships/memberships-rules"
import { useUpdateUserMutation } from "@/modules/users/use-users"
import { userDetailsQueryKey } from "@/modules/users-onboarding/use-users-onboarding"

function formatValue(value: string | null | undefined | boolean): string {
  if (value === null || value === undefined || value === "") return "—"
  if (typeof value === "boolean") return value ? "Sim" : "Não"
  return String(value)
}

export function profileFormCardClassName(editing: boolean) {
  return cn(
    !editing && "border-none ring-0 shadow-md transition-all duration-450",
    editing &&
      "bg-primary/5 border-primary/40 ring-primary/40 shadow-md transition-all duration-450"
  )
}

export function ProfileFieldReveal({
  open,
  className,
  children,
}: {
  open: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-450 ease-in-out",
        open
          ? "grid-rows-[1fr] opacity-100"
          : "pointer-events-none grid-rows-[0fr] opacity-0",
        className
      )}
      aria-hidden={!open}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  )
}

export type ProfileSelectOption = {
  value: string
  label: string
}

export function ProfileField({
  label,
  value,
  icon: Icon,
  className,
  mono,
  multiline,
  editing = false,
  editValue,
  onEditChange,
  inputId,
  inputType = "text",
  required,
  editSelectOptions,
  editPlaceholder,
  editDisabled,
}: {
  label: string
  value: string | null | undefined | boolean
  icon: LucideIcon
  className?: string
  mono?: boolean
  multiline?: boolean
  editing?: boolean
  editValue?: string
  onEditChange?: (value: string) => void
  inputId?: string
  inputType?: React.HTMLInputTypeAttribute
  required?: boolean
  editSelectOptions?: ProfileSelectOption[]
  editPlaceholder?: string
  editDisabled?: boolean
}) {
  const display = formatValue(value)
  const empty = display === "—"
  const isSelectEdit =
    editing && Boolean(editSelectOptions?.length && onEditChange)

  const activeFieldStyles =
    "group-focus-within:border-primary/40 group-has-data-[state=open]:border-primary/40"
  const activeLegendStyles =
    "group-focus-within:text-primary group-has-data-[state=open]:text-primary"
  const activeIconStyles =
    "group-focus-within:bg-transparent group-focus-within:text-primary group-focus-within:ring-0 group-focus-within:shadow-none group-has-data-[state=open]:bg-transparent group-has-data-[state=open]:text-primary group-has-data-[state=open]:ring-0 group-has-data-[state=open]:shadow-none"
  const activeInputStyles =
    "group-focus-within:text-primary group-has-data-[state=open]:text-primary bg-transparent px-2 dark:bg-transparent"
  const profileSelectTriggerClassName = cn(
    "min-w-0 flex-1 h-auto w-full border-0 bg-transparent p-0 shadow-none",
    "text-sm font-medium transition-all duration-450",
    "focus-visible:border-0 focus-visible:ring-0",
    "data-[size=default]:h-auto data-[size=sm]:h-auto",
    "dark:bg-transparent dark:hover:bg-transparent",
    "[&_svg]:text-muted-foreground [&_svg]:transition-all [&_svg]:duration-450",
    "focus:text-primary focus:[&_svg]:text-primary",
    "data-[state=open]:text-primary data-[state=open]:[&_svg]:text-primary",
    editing && activeInputStyles
  )

  return (
    <fieldset className={cn("group min-w-0 space-y-2", className)}>
      <legend
        className={cn(
          "text-xs font-medium tracking-wide text-muted-foreground transition-all duration-450",
          editing && activeLegendStyles
        )}
      >
        {label}
      </legend>
      <div
        className={cn(
          "flex min-h-10 gap-3 border border-border/60 bg-muted/25 px-3 py-2.5 transition-all duration-450",
          multiline && !empty && !editing ? "items-start" : "items-center",
          !editing && empty && "text-muted-foreground",
          editing && activeFieldStyles
        )}
      >
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center bg-background/80 text-muted-foreground shadow-sm ring-1 ring-border/50 transition-all duration-450",
            editing && activeIconStyles
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>
        {isSelectEdit ? (
          <Select
            value={editValue ?? ""}
            onValueChange={onEditChange}
            disabled={editDisabled}
          >
            <SelectTrigger
              id={inputId}
              className={profileSelectTriggerClassName}
            >
              <SelectValue placeholder={editPlaceholder ?? "Selecione..."} />
            </SelectTrigger>
            <SelectContent>
              {editSelectOptions!.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : editing && onEditChange ? (
          <Input
            id={inputId}
            type={inputType}
            value={editValue ?? ""}
            onChange={(e) => onEditChange(e.target.value)}
            required={required}
            className={cn(
              "min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 transition-all duration-450",
              mono && "font-mono text-xs sm:text-sm",
              !empty && activeInputStyles
            )}
          />
        ) : (
          <span
            className={cn(
              "min-w-0 flex-1 text-sm font-medium text-foreground",
              mono && "font-mono text-xs sm:text-sm",
              empty && "font-normal",
              multiline && !empty
                ? "whitespace-pre-wrap wrap-break-words"
                : "truncate"
            )}
          >
            {display}
          </span>
        )}
      </div>
    </fieldset>
  )
}

export function ProfileEditActions({
  editing,
  canEdit,
  onStartEdit,
  onCancel,
  onSave,
  isPending,
  editLabel = "Editar",
  addLabel = "Adicionar",
  isEmpty = false,
}: {
  editing: boolean
  canEdit: boolean
  onStartEdit: () => void
  onCancel: () => void
  onSave: () => void
  isPending?: boolean
  editLabel?: string
  addLabel?: string
  isEmpty?: boolean
}) {
  if (!canEdit) return null

  if (!editing) {
    return (
      <div className="flex w-full">
        <Button
          type="button"
          variant="outline"
          onClick={onStartEdit}
          aria-label={isEmpty ? addLabel : editLabel}
          tooltip={isEmpty ? addLabel : editLabel}
          className="w-full"
        >
          <Pencil className="size-4" aria-hidden />
          {isEmpty ? addLabel : editLabel}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        onClick={onSave}
        disabled={isPending}
        className="w-full flex-1"
      >
        {isPending ? "Salvando..." : "Salvar"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Cancelar edição"
        tooltip="Cancelar edição"
        className="border-0 shadow-none ring-0"
        onClick={onCancel}
        disabled={isPending}
      >
        <X className="size-4" aria-hidden />
      </Button>
    </div>
  )
}

function ProfilePersonalInfoFields({
  user,
  enterpriseId,
  canEdit,
  editing,
  onEditingChange,
  onUpdateSuccess,
}: {
  user: MeResponse["user"]
  enterpriseId?: string
  canEdit?: boolean
  editing: boolean
  onEditingChange: (editing: boolean) => void
  onUpdateSuccess?: () => void
}) {
  const queryClient = useQueryClient()
  const mutation = useUpdateUserMutation(enterpriseId ?? "", user.id)
  const [userName, setUserName] = useState(user.name)
  const [userRegistration, setUserRegistration] = useState(user.registration)
  const [userEmail, setUserEmail] = useState(user.email ?? "")
  const [userPhone, setUserPhone] = useState(user.phone ?? "")

  const resetDraft = () => {
    setUserName(user.name)
    setUserRegistration(user.registration)
    setUserEmail(user.email ?? "")
    setUserPhone(user.phone ?? "")
  }

  const handleStartEdit = () => {
    resetDraft()
    onEditingChange(true)
  }

  const handleCancel = () => {
    resetDraft()
    onEditingChange(false)
  }

  async function handleSave() {
    const patch: {
      userName?: string
      userRegistration?: string
      userEmail?: string
      userPhone?: string
    } = {}

    const name = userName.trim()
    const registration = normalizeRegistration(userRegistration)
    const email = normalizeEmail(userEmail)
    const phone = normalizePhone(userPhone)

    if (name && name !== user.name) patch.userName = name
    if (registration && registration !== user.registration) {
      const regParsed = cpfCnpjSchema.safeParse(registration)
      if (!regParsed.success) {
        toast.error("CPF/CNPJ inválido.")
        return
      }
      patch.userRegistration = regParsed.data
    }
    if (email && email !== (user.email ?? "")) patch.userEmail = email
    if (phone && phone !== (user.phone ?? "")) {
      const phoneParsed = phoneE164Schema.safeParse(phone)
      if (!phoneParsed.success) {
        toast.error("Telefone inválido. Use formato +5511999999999.")
        return
      }
      patch.userPhone = phoneParsed.data
    }

    if (name.length < 2) {
      toast.error("Nome completo deve ter pelo menos 2 caracteres.")
      return
    }

    if (Object.keys(patch).length === 0) {
      toast.message("Nenhuma alteração detectada.")
      onEditingChange(false)
      return
    }

    try {
      await mutation.mutateAsync(patch)
      if (enterpriseId) {
        void queryClient.invalidateQueries({
          queryKey: userDetailsQueryKey(enterpriseId, user.id),
        })
      }
      onEditingChange(false)
      onUpdateSuccess?.()
    } catch {
      /* erros de mutação tratados globalmente pelo QueryClient */
    }
  }

  const showEditControls = Boolean(canEdit && enterpriseId)

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <ProfileField
          label="Nome completo"
          value={user.name}
          icon={User}
          className="sm:col-span-2"
          editing={editing}
          editValue={userName}
          onEditChange={setUserName}
          inputId="profile-userName"
          required
        />
        <ProfileField
          label="E-mail"
          value={user.email}
          icon={Mail}
          editing={editing}
          editValue={userEmail}
          onEditChange={setUserEmail}
          inputId="profile-userEmail"
          inputType="email"
          required
        />
        <ProfileField
          label="Telefone"
          value={formatPhone(user.phone)}
          icon={Phone}
          editing={editing}
          editValue={userPhone}
          onEditChange={setUserPhone}
          inputId="profile-userPhone"
          required
        />
        <ProfileField
          label="CPF / CNPJ"
          value={formatCpfCnpj(user.registration)}
          icon={BadgeCheck}
          mono
          editing={editing}
          editValue={userRegistration}
          onEditChange={setUserRegistration}
          inputId="profile-userRegistration"
          required
        />
        <ProfileField
          label="Perfil completo"
          value={user.onboardingCompleted}
          icon={UserRound}
        />
      </div>

      {showEditControls && (
        <ProfileEditActions
          editing={editing}
          canEdit
          onStartEdit={handleStartEdit}
          onCancel={handleCancel}
          onSave={() => void handleSave()}
          isPending={mutation.isPending}
          editLabel="Editar perfil"
        />
      )}
    </>
  )
}

export function ProfileSection({
  user,
  enterpriseId,
  canEdit,
  onUpdateSuccess,
}: {
  user: MeResponse["user"]
  enterpriseId?: string
  canEdit?: boolean
  onUpdateSuccess?: () => void
}) {
  const initials = getUserInitials(user.name)
  const [editing, setEditing] = useState(false)

  return (
    <>
      <Card className="border-none ring-0 shadow-md">
        <CardContent className="space-y-4 pt-6">
          <div className="flex justify-center">
            <Avatar
              size="default"
              className="size-20 shrink-0 ring-2 ring-primary shadow-md after:border-0 sm:size-24"
            >
              <AvatarFallback className="bg-transparent text-3xl font-semibold tracking-tight sm:text-4xl">
                <span className="text-primary">{initials}</span>
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="space-y-2 text-center">
            <h1 className="font-heading text-xl font-semibold sm:text-2xl">
              {user.name}
            </h1>
          </div>
        </CardContent>
      </Card>

      <ProfilePersonalInfoCard
        user={user}
        enterpriseId={enterpriseId}
        canEdit={canEdit}
        editing={editing}
        onEditingChange={setEditing}
        onUpdateSuccess={onUpdateSuccess}
      />
    </>
  )
}

function ProfilePersonalInfoCard({
  user,
  enterpriseId,
  canEdit,
  editing,
  onEditingChange,
  onUpdateSuccess,
}: {
  user: MeResponse["user"]
  enterpriseId?: string
  canEdit?: boolean
  editing: boolean
  onEditingChange: (editing: boolean) => void
  onUpdateSuccess?: () => void
}) {
  return (
    <Card className={profileFormCardClassName(editing)}>
      <CardHeader>
        <CardTitle className="text-base">
          {editing ? "Editar dados do usuário" : "Dados do usuário"}
        </CardTitle>
        <CardDescription>
          {editing
            ? "Edite as informações cadastrais do usuário"
            : "Informações cadastrais do usuário"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProfilePersonalInfoFields
          user={user}
          enterpriseId={enterpriseId}
          canEdit={canEdit}
          editing={editing}
          onEditingChange={onEditingChange}
          onUpdateSuccess={onUpdateSuccess}
        />
      </CardContent>
    </Card>
  )
}
