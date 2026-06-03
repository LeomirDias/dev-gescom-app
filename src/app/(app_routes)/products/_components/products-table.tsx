"use client"

import Link from "next/link"
import { ChevronLeft, ChevronRight, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductStatusBadge } from "@/app/(app_routes)/products/_components/product-status-badge"
import { PRODUCTS_BASE_PATH } from "@/app/(app_routes)/products/_components/products-constants"
import type { ProductEnterprise } from "@/modules/products/products.schema"

type ProductsTableProps = {
  items: ProductEnterprise[]
  total: number
  limit: number
  offset: number
  onPageChange: (offset: number) => void
}

export function ProductsTable({
  items,
  total,
  limit,
  offset,
  onPageChange,
}: ProductsTableProps) {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canPrev = offset > 0
  const canNext = offset + limit < total

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card px-6 py-12 text-center">
        <p className="font-medium text-foreground">Nenhum produto encontrado</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajuste os filtros de pesquisa.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Descrição</th>
              <th className="px-4 py-3 font-medium">Cód. barras</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Lote</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-mono text-xs">
                  {item.code ?? "—"}
                </td>
                <td className="px-4 py-3">{item.description}</td>
                <td className="px-4 py-3 font-mono text-xs">{item.barCode}</td>
                <td className="px-4 py-3">
                  <ProductStatusBadge status={item.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.controlsBatch ? "Sim" : "Não"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`${PRODUCTS_BASE_PATH}/${item.id}`}>
                      <Eye className="mr-1 size-4" />
                      Ver
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`${PRODUCTS_BASE_PATH}/${item.id}`}
            className="block rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">{item.description}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  Cód. {item.code ?? "—"} · {item.barCode}
                </p>
              </div>
              <ProductStatusBadge status={item.status} />
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          Página {page} de {totalPages} · {total} registo(s)
        </p>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!canPrev}
            onClick={() => onPageChange(Math.max(0, offset - limit))}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!canNext}
            onClick={() => onPageChange(offset + limit)}
            aria-label="Página seguinte"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
