"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MEMBER_STATUS_OPTIONS } from "@/modules/memberships/member-status-label"
import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"

type ClientsFiltersProps = {
  filters: ListMembersQuery
  onChange: (filters: ListMembersQuery) => void
  onApply: () => void
  onClear: () => void
}

export function ClientsFilters({
  filters,
  onChange,
  onApply,
  onClear,
}: ClientsFiltersProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="filter-status">Status</FieldLabel>
          <Select
            value={filters.status ?? "all"}
            onValueChange={(v) =>
              onChange({
                ...filters,
                status: v === "all" ? undefined : (v as ListMembersQuery["status"]),
              })
            }
          >
            <SelectTrigger id="filter-status" className="w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {MEMBER_STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel htmlFor="filter-email">E-mail</FieldLabel>
          <Input
            id="filter-email"
            name="email"
            type="email"
            defaultValue={filters.email ?? ""}
            placeholder="Ex: usuario@email.com"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="filter-registration">CPF/CNPJ</FieldLabel>
          <Input
            id="filter-registration"
            name="registration"
            defaultValue={filters.registration ?? ""}
            placeholder="Ex: 12345678901"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="filter-phone">Telefone</FieldLabel>
          <Input
            id="filter-phone"
            name="phone"
            defaultValue={filters.phone ?? ""}
            placeholder="Ex: 11999999999"
          />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={onApply} tooltip="Aplicar filtros">
          Filtrar
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
