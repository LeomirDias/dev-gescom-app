"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SalesDateFilters } from "@/modules/sales/sales-constants"
import type { ListSalesQuery } from "@/modules/sales/sales.schema"
import {
  BUDGET_CLOSURE_LABELS,
  SALE_STATUS_LABELS,
  SALE_TYPE_LABELS,
} from "@/modules/sales/sales-labels"

type SalesFiltersProps = {
  filters: ListSalesQuery
  dateFilters: SalesDateFilters
  onChange: (filters: ListSalesQuery) => void
  onApply: () => void
  onClear: () => void
}

const ALL = "all"

export function SalesFilters({
  filters,
  dateFilters,
  onChange,
  onApply,
  onClear,
}: SalesFiltersProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="filter-order-number">Pedido</FieldLabel>
          <Input
            id="filter-order-number"
            name="orderNumber"
            inputMode="numeric"
            defaultValue={filters.orderNumber ?? ""}
            placeholder="Ex: 1042"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="filter-seller">Vendedor</FieldLabel>
          <Input
            id="filter-seller"
            name="seller"
            defaultValue={filters.seller ?? ""}
            placeholder="Ex: Maria Silva"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="filter-client">Cliente</FieldLabel>
          <Input
            id="filter-client"
            name="client"
            defaultValue={filters.client ?? ""}
            placeholder="Ex: João Souza"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="filter-date-from">De</FieldLabel>
          <Input
            id="filter-date-from"
            name="dateFrom"
            type="date"
            defaultValue={dateFilters.dateFrom ?? ""}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="filter-date-to">Até</FieldLabel>
          <Input
            id="filter-date-to"
            name="dateTo"
            type="date"
            defaultValue={dateFilters.dateTo ?? ""}
          />
        </Field>
      </div>

      <FieldSeparator className="my-4">Filtros</FieldSeparator>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field>
          <FieldLabel htmlFor="sale-type">Tipo</FieldLabel>
          <Select
            value={filters.type ?? ALL}
            onValueChange={(v) =>
              onChange({
                ...filters,
                type: v === ALL ? undefined : (v as ListSalesQuery["type"]),
              })
            }
          >
            <SelectTrigger id="sale-type" className="w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos</SelectItem>
              {Object.entries(SALE_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="sale-status">Status</FieldLabel>
          <Select
            value={filters.status ?? ALL}
            onValueChange={(v) =>
              onChange({
                ...filters,
                status: v === ALL ? undefined : (v as ListSalesQuery["status"]),
              })
            }
          >
            <SelectTrigger id="sale-status" className="w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos</SelectItem>
              {Object.entries(SALE_STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel htmlFor="budget-closure">Fecho orçamento</FieldLabel>
          <Select
            value={filters.budgetClosureSituation ?? ALL}
            onValueChange={(v) =>
              onChange({
                ...filters,
                budgetClosureSituation:
                  v === ALL
                    ? undefined
                    : (v as ListSalesQuery["budgetClosureSituation"]),
              })
            }
          >
            <SelectTrigger id="budget-closure" className="w-full">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Todos</SelectItem>
              {Object.entries(BUDGET_CLOSURE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
