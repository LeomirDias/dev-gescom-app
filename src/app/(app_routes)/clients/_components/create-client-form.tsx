"use client"

import {
  CreateMemberWithUserForm,
  type CreateMemberWithUserFormProps,
} from "@/app/(app_routes)/members/_components/create-member-with-user-form"

type CreateClientFormProps = Omit<
  CreateMemberWithUserFormProps,
  "defaultClass" | "variant" | "emptyFieldsMessage" | "class"
>

export function CreateClientForm(props: CreateClientFormProps) {
  return (
    <CreateMemberWithUserForm
      class="CLIENTE"
      defaultClass="CLIENTE"
      variant="sheet"
      title="Novo cliente"
      subtitle="Crie um novo cliente com um novo usuário"
      submitLabel="Criar cliente"
      pendingLabel="Criando cliente..."
      emptyFieldsMessage="cliente"
      {...props}
    />
  )
}
