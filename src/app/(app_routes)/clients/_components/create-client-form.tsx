"use client"

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
import { Separator } from "@/components/ui/separator"
import { HttpError } from "@/lib/api/http-error"
import { toastHttpError } from "@/modules/authentication/http-error-feedback"
import {
  CLIENT_MEMBER_CLASS,
  CLIENTS_BASE_PATH,
} from "@/app/(app_routes)/clients/_components/clients-constants"
import {
  normalizeEmail,
  normalizePhone,
  normalizeRegistration,
} from "@/modules/memberships/memberships-rules"
import { useCreateMemberWithUserMutation } from "@/modules/memberships/use-members"

export function CreateClientForm({ enterpriseId }: { enterpriseId: string }) {
  const router = useRouter()
  const mutation = useCreateMemberWithUserMutation(enterpriseId)

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
      toast.error("Preencha todos os campos do usuário.")
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
          class: CLIENT_MEMBER_CLASS,
          departments: [],
        },
      })
      router.push(`${CLIENTS_BASE_PATH}/${result.member.id}`)
    } catch (error) {
      if (error instanceof HttpError) {
        toastHttpError(error, "Não foi possível criar o cliente.")
        return
      }
      toast.error("Não foi possível criar o cliente.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Novo cliente</CardTitle>
        <CardDescription>
          Crie um novo cliente e vincule-o à empresa.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Clientes não possuem departamentos associados nem recebem e-mails de convite.
        </p>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field className="sm:col-span-2">
                <Input
                  id="userName"
                  name="userName"
                  placeholder="Informe o nome"
                  required
                />
              </Field>
              <Field>
                <Input
                  id="userRegistration"
                  name="userRegistration"
                  placeholder="Informe o CPF/CNPJ"
                  required
                />
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
                <Input
                  id="userPhone"
                  name="userPhone"
                  required
                  placeholder="Informe o telefone"
                />
              </Field>
            </div>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full sm:w-auto"
              tooltip="Criar cliente"
            >
              {mutation.isPending ? "A criar..." : "Criar cliente"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
