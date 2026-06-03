"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatPhone } from "@/lib/formatters"
import type { User } from "@/modules/users/users.schema"

type LinkClientUsersTableProps = {
  items: User[]
  total: number
  limit: number
  offset: number
  selectedUserId: string | null
  onSelectUser: (userId: string) => void
  onPageChange: (offset: number) => void
  nameFilterActive: boolean
}

export function LinkClientUsersTable({
  items,
  total,
  limit,
  offset,
  selectedUserId,
  onSelectUser,
  onPageChange,
  nameFilterActive,
}: LinkClientUsersTableProps) {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.max(1, Math.ceil(total / limit))
  const canPrev = offset > 0
  const canNext = offset + limit < total

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card px-6 py-12 text-center">
        <p className="font-medium text-foreground">
          Nenhum utilizador encontrado
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {nameFilterActive
            ? "Nenhum resultado corresponde ao nome. Ajuste os filtros ou pesquise de novo."
            : "Ajuste os filtros ou pesquise no catálogo global de utilizadores."}
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
              <th className="w-10 px-4 py-3" aria-label="Seleccionar" />
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Telefone</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const selected = selectedUserId === item.id
              return (
                <tr
                  key={item.id}
                  className={cn(
                    "cursor-pointer border-b transition-colors last:border-0",
                    selected && "bg-primary/5"
                  )}
                  onClick={() => onSelectUser(item.id)}
                >
                  <td className="p-4">
                    <input
                      type="radio"
                      name="link-user"
                      checked={selected}
                      onChange={() => onSelectUser(item.id)}
                      aria-label={`Seleccionar ${item.userName}`}
                      className="size-4 accent-primary"
                    />
                  </td>
                  <td className="p-4 font-medium">{item.userName}</td>
                  <td className="max-w-[200px] truncate p-4">
                    {item.userEmail}
                  </td>
                  <td className="p-4">{formatPhone(item.userPhone)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {items.map((item) => {
          const selected = selectedUserId === item.id
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectUser(item.id)}
                className={cn(
                  "w-full rounded-lg border bg-card p-4 text-left shadow-sm transition-colors",
                  selected && "border-primary bg-primary/5"
                )}
              >
                <p className="font-medium">{item.userName}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {item.userEmail}
                </p>
                <p className="mt-1 text-sm">{formatPhone(item.userPhone)}</p>
              </button>
            </li>
          )
        })}
      </ul>

      <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          Pagina {page} de {totalPages} ({total} registos)
        </span>
        <div className="flex gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!canPrev}
            onClick={() => onPageChange(Math.max(0, offset - limit))}
            tooltip="Pagina anterior"
            aria-label="Pagina anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={!canNext}
            onClick={() => onPageChange(offset + limit)}
            tooltip="Proxima pagina"
            aria-label="Proxima pagina"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
