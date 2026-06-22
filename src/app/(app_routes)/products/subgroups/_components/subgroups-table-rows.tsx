"use client"

import { formatDateOnly } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { ProductSubgroup } from "@/modules/products/products-catalogs.schema"

type SubgroupsTableRowsProps = {
  items: ProductSubgroup[]
  pluralLabel: string
}

export function SubgroupsTableRows({
  items,
  pluralLabel,
}: SubgroupsTableRowsProps) {
  const listLabel = `Lista de ${pluralLabel}`

  return (
    <>
      <div className="hidden overflow-hidden border md:block">
        <table className="w-full text-sm" aria-label={listLabel}>
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">
                Descrição
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Criado em
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Atualizado em
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                className={cn(
                  "border-b transition-colors last:border-0",
                  idx % 2 === 1 && "bg-muted/20"
                )}
              >
                <td className="px-4 py-3">{item.description}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDateOnly(item.createdAt)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDateOnly(item.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden" aria-label={listLabel}>
        {items.map((item) => (
          <li key={item.id} className="border bg-card p-4 shadow-sm">
            <p className="font-medium">{item.description}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Criado em: {formatDateOnly(item.createdAt)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Atualizado em: {formatDateOnly(item.updatedAt)}
            </p>
          </li>
        ))}
      </ul>
    </>
  )
}
