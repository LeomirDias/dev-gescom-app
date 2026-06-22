"use client"

import type { KeyboardEvent } from "react"

import { StatusBadge } from "@/components/global/returns/status-badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ProductEnterpriseListItem } from "@/modules/products/products.schema"

type ProductsTableRowsProps = {
  items: ProductEnterpriseListItem[]
  pluralLabel: string
  onView: (productId: string) => void
}

function formatCellValue(value: string | null | undefined): string {
  if (!value?.trim()) return "—"
  return value
}

export function ProductsTableRows({
  items,
  pluralLabel,
  onView,
}: ProductsTableRowsProps) {
  const listLabel = `Lista de ${pluralLabel}`

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    productId: string
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onView(productId)
    }
  }

  return (
    <>
      <div className="hidden overflow-hidden border md:block">
        <table className="w-full text-sm" aria-label={listLabel}>
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Código
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Descrição
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Cód. barras
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Grupo
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Marca
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Locação
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                onClick={() => onView(item.id)}
                className={cn(
                  "cursor-pointer border-b transition-colors last:border-0",
                  "hover:bg-primary/5 focus-within:bg-primary/5",
                  idx % 2 === 1 && "bg-muted/20"
                )}
                tabIndex={0}
                role="row"
                aria-label={`Ver detalhes de ${item.description}`}
                onKeyDown={(event) => handleRowKeyDown(event, item.id)}
              >
                <td className="px-4 py-3 font-mono text-xs tabular-nums">
                  {item.code ?? "—"}
                </td>
                <td className="px-4 py-3">{item.description}</td>
                <td className="px-4 py-3 font-mono text-xs tabular-nums">
                  {item.barCode}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3">{formatCellValue(item.group)}</td>
                <td className="px-4 py-3">{formatCellValue(item.brand)}</td>
                <td className="px-4 py-3">{formatCellValue(item.stockLocation)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden" aria-label={listLabel}>
        {items.map((item) => (
          <li key={item.id} className="border bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium">{item.description}</p>
                <p className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                  {item.code ?? "—"}
                </p>
                <p className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                  {item.barCode}
                </p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
              <div className="flex gap-1">
                <dt>Grupo:</dt>
                <dd>{formatCellValue(item.group)}</dd>
              </div>
              <div className="flex gap-1">
                <dt>Marca:</dt>
                <dd>{formatCellValue(item.brand)}</dd>
              </div>
              <div className="flex gap-1">
                <dt>Locação:</dt>
                <dd>{formatCellValue(item.stockLocation)}</dd>
              </div>
            </dl>
            <Button
              type="button"
              className="mt-3 w-full"
              variant="outline"
              size="sm"
              onClick={() => onView(item.id)}
            >
              Visualizar
            </Button>
          </li>
        ))}
      </ul>
    </>
  )
}
