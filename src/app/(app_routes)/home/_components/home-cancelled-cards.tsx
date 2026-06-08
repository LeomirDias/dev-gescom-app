"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { StatusBreakdown } from "@/modules/sales/sales-analytics.schema"
import { formatCurrency, formatNumber } from "@/modules/sales/sales-labels"

type HomeCancelledCardsProps = {
  data?: StatusBreakdown
  loading?: boolean
}

function findCancelledItem(
  data: StatusBreakdown | undefined,
  type: "VENDA" | "ORCAMENTO"
) {
  return data?.breakdown.find(
    (item) => item.type === type && item.status === "CANCELADA"
  )
}

export function HomeCancelledCards({
  data,
  loading,
}: HomeCancelledCardsProps) {
  const cards = [
    {
      label: "Vendas canceladas",
      item: findCancelledItem(data, "VENDA"),
    },
    {
      label: "Orçamentos cancelados",
      item: findCancelledItem(data, "ORCAMENTO"),
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-36" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="mt-2 h-4 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">
              {formatNumber(card.item?.count ?? 0)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatCurrency(card.item?.value ?? 0)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
