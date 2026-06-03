"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { ListProductsEnterprisesQuery } from "@/modules/products/products.schema"

type ProductsFiltersProps = {
  filters: ListProductsEnterprisesQuery
  onChange: (filters: ListProductsEnterprisesQuery) => void
  onApply: () => void
  onClear: () => void
}

export function ProductsFilters({
  filters,
  onChange,
  onApply,
  onClear,
}: ProductsFiltersProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field className="sm:col-span-2 lg:col-span-1">
          <FieldLabel htmlFor="filter-search">Pesquisa</FieldLabel>
          <Input
            id="filter-search"
            name="search"
            placeholder="Descrição, código de barras ou código"
            value={filters.search ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                search: e.target.value || undefined,
              })
            }
          />
        </Field>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={onApply}>
          Aplicar filtros
        </Button>
        <Button type="button" variant="outline" onClick={onClear}>
          Limpar
        </Button>
      </div>
    </div>
  )
}
