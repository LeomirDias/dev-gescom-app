"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ListSalesQuery } from "@/modules/sales/sales.schema"
import {
  BUDGET_CLOSURE_LABELS,
  SALE_STATUS_LABELS,
  SALE_TYPE_LABELS,
} from "@/modules/sales/sales-labels"

type SalesFiltersProps = {
  filters: ListSalesQuery
  onChange: (filters: ListSalesQuery) => void
  onApply: () => void
  onClear: () => void
}

const ALL = "__all__"

export function SalesFilters({
  filters,
  onChange,
  onApply,
  onClear,
}: SalesFiltersProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="sale-type">Tipo</Label>
          <Select
            value={filters.type ?? ALL}
            onValueChange={(v) =>
              onChange({
                ...filters,
                type: v === ALL ? undefined : (v as ListSalesQuery["type"]),
              })
            }
          >
            <SelectTrigger id="sale-type">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="sale-status">Status</Label>
          <Select
            value={filters.status ?? ALL}
            onValueChange={(v) =>
              onChange({
                ...filters,
                status: v === ALL ? undefined : (v as ListSalesQuery["status"]),
              })
            }
          >
            <SelectTrigger id="sale-status">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget-closure">Fecho orçamento</Label>
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
            <SelectTrigger id="budget-closure">
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
        </div>

        <div className="flex items-end gap-2">
          <Button type="button" onClick={onApply} className="flex-1">
            Filtrar
          </Button>
          <Button type="button" variant="outline" onClick={onClear}>
            Limpar
          </Button>
        </div>
      </div>
    </div>
  )
}
