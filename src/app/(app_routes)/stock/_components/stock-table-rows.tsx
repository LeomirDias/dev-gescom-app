"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export type StockColumn<T> = {
  header: string
  cell: (item: T) => ReactNode
  mobileLabel?: string
}

type StockTableRowsProps<T extends { id: string }> = {
  items: T[]
  columns: StockColumn<T>[]
  listLabel: string
  mobileTitle: (item: T) => string
  mobileSubtitle?: (item: T) => string
}

export function StockTableRows<T extends { id: string }>({
  items,
  columns,
  listLabel,
  mobileTitle,
  mobileSubtitle,
}: StockTableRowsProps<T>) {
  return (
    <>
      <div className="hidden overflow-hidden border md:block">
        <table className="w-full text-sm" aria-label={listLabel}>
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  scope="col"
                  className="px-4 py-3 font-medium"
                >
                  {column.header}
                </th>
              ))}
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
                {columns.map((column) => (
                  <td key={column.header} className="px-4 py-3">
                    {column.cell(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden" aria-label={listLabel}>
        {items.map((item) => (
          <li key={item.id} className="border bg-card p-4 shadow-sm">
            <p className="font-medium">{mobileTitle(item)}</p>
            {mobileSubtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {mobileSubtitle(item)}
              </p>
            )}
            {columns.length > 0 && (
              <dl className="mt-2 space-y-1">
                {columns.map((column) => (
                  <div
                    key={column.header}
                    className="flex gap-2 text-xs text-muted-foreground"
                  >
                    <dt className="shrink-0 font-medium">
                      {column.mobileLabel ?? column.header}:
                    </dt>
                    <dd>{column.cell(item)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
