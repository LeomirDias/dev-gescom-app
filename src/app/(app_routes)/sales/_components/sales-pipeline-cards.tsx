"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { PipelineKpis } from "@/modules/sales/sales-analytics.schema"
import { formatCurrency, formatNumber, formatPercent } from "@/modules/sales/sales-labels"

type SalesPipelineCardsProps = {
  kpis?: PipelineKpis
  loading?: boolean
}

export function SalesPipelineCards({ kpis, loading }: SalesPipelineCardsProps) {
  const cards = [
    {
      label: "Vendas abertas",
      value: formatNumber(kpis?.openSalesCount),
      sub: formatCurrency(kpis?.openSalesValue),
    },
    {
      label: "Orçamentos abertos",
      value: formatNumber(kpis?.openBudgetsCount),
      sub: formatCurrency(kpis?.openBudgetsValue),
    },
    {
      label: "Orçamentos parciais",
      value: formatNumber(kpis?.budgetsPartialCount),
      sub: undefined,
    },
    {
      label: "Taxa de conversão",
      value: formatPercent(kpis?.conversionRatePercent),
      sub: `${formatNumber(kpis?.conversionCountInPeriod)} conversões`,
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">{card.value}</p>
            {card.sub && (
              <p className="mt-1 text-sm text-muted-foreground">{card.sub}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
