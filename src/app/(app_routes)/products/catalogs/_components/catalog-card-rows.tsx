"use client"

import type { ReactNode } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type CatalogCardField<T> = {
  label: string
  cell: (item: T) => ReactNode
}

type CatalogCardRowsProps<T extends { id: string }> = {
  items: T[]
  listLabel: string
  cardTitle: (item: T) => string
  cardSubtitle?: (item: T) => string
  fields?: CatalogCardField<T>[]
}

export function CatalogCardRows<T extends { id: string }>({
  items,
  listLabel,
  cardTitle,
  cardSubtitle,
  fields = [],
}: CatalogCardRowsProps<T>) {
  return (
    <ul
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-label={listLabel}
    >
      {items.map((item) => (
        <li key={item.id}>
          <Card className="h-full transition-colors hover:bg-muted/30">
            <CardHeader>
              <CardTitle>{cardTitle(item)}</CardTitle>
              {cardSubtitle && (
                <CardDescription>{cardSubtitle(item)}</CardDescription>
              )}
            </CardHeader>
            {fields.length > 0 && (
              <CardContent>
                <dl className="space-y-1">
                  {fields.map((field) => (
                    <div
                      key={field.label}
                      className="flex gap-2 text-xs text-muted-foreground"
                    >
                      <dt className="shrink-0 font-medium">{field.label}:</dt>
                      <dd className="text-foreground">{field.cell(item)}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            )}
          </Card>
        </li>
      ))}
    </ul>
  )
}
