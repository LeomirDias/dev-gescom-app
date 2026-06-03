"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { LinkUsersDraftFilters } from "@/modules/users/users-rules"

type LinkClientUsersFiltersProps = {
  draft: LinkUsersDraftFilters
  onChange: (draft: LinkUsersDraftFilters) => void
  onApply: () => void
  onClear: () => void
}

export function LinkClientUsersFilters({
  draft,
  onChange,
  onApply,
  onClear,
}: LinkClientUsersFiltersProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="link-filter-name">Nome</FieldLabel>
          <Input
            id="link-filter-name"
            name="name"
            value={draft.name}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
            placeholder="Ex: Maria Silva"
          />
          <FieldDescription>
            Filtro local sobre os resultados da pesquisa.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="link-filter-registration">CPF/CNPJ</FieldLabel>
          <Input
            id="link-filter-registration"
            name="registration"
            value={draft.registration}
            onChange={(e) =>
              onChange({ ...draft, registration: e.target.value })
            }
            placeholder="Ex: 12345678901"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="link-filter-email">E-mail</FieldLabel>
          <Input
            id="link-filter-email"
            name="email"
            type="email"
            value={draft.email}
            onChange={(e) => onChange({ ...draft, email: e.target.value })}
            placeholder="Ex: usuario@email.com"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="link-filter-phone">Telefone</FieldLabel>
          <Input
            id="link-filter-phone"
            name="phone"
            value={draft.phone}
            onChange={(e) => onChange({ ...draft, phone: e.target.value })}
            placeholder="Ex: 11999999999"
          />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={onApply} tooltip="Pesquisar utilizadores">
          Pesquisar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          tooltip="Limpar filtros"
        >
          Limpar
        </Button>
      </div>
    </div>
  )
}
