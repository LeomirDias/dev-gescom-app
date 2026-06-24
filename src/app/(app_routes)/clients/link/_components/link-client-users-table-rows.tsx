"use client"

import type { KeyboardEvent } from "react"

import { Button } from "@/components/ui/button"
import { formatPhone } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { User } from "@/modules/users/users.schema"

type LinkClientUsersTableRowsProps = {
  items: User[]
  selectedUserId: string | null
  onSelectUser: (userId: string) => void
}

export function LinkClientUsersTableRows({
  items,
  selectedUserId,
  onSelectUser,
}: LinkClientUsersTableRowsProps) {
  const listLabel = "Lista de usuários para vincular como cliente"

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    userId: string
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onSelectUser(userId)
    }
  }

  return (
    <>
      <div className="hidden overflow-hidden border md:block">
        <table className="w-full text-sm" aria-label={listLabel}>
          <thead className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
            <tr>
              <th
                scope="col"
                className="w-10 px-4 py-3"
                aria-label="Selecionar"
              />
              <th scope="col" className="px-4 py-3 font-medium">
                Nome
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                E-mail
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Telefone
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const selected = selectedUserId === item.id
              return (
                <tr
                  key={item.id}
                  onClick={() => onSelectUser(item.id)}
                  className={cn(
                    "cursor-pointer border-b transition-colors last:border-0",
                    "hover:bg-primary/5 focus-within:bg-primary/5",
                    selected && "bg-primary/5",
                    idx % 2 === 1 && "bg-muted/20"
                  )}
                  tabIndex={0}
                  role="row"
                  aria-label={`Selecionar ${item.userName}`}
                  aria-selected={selected}
                  onKeyDown={(event) => handleRowKeyDown(event, item.id)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="radio"
                      name="link-user"
                      checked={selected}
                      onChange={() => onSelectUser(item.id)}
                      aria-label={`Selecionar ${item.userName}`}
                      className="size-4 accent-primary"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{item.userName}</td>
                  <td className="max-w-[200px] px-4 py-3">
                    <span
                      className="block truncate text-muted-foreground"
                      title={item.userEmail}
                    >
                      {item.userEmail}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">
                    {formatPhone(item.userPhone)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden" aria-label={listLabel}>
        {items.map((item) => {
          const selected = selectedUserId === item.id
          return (
            <li
              key={item.id}
              className={cn(
                "border bg-card p-4 shadow-sm",
                selected && "border-primary bg-primary/5"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.userName}</p>
                  <p
                    className="mt-2 truncate text-xs text-muted-foreground"
                    title={item.userEmail}
                  >
                    {item.userEmail}
                  </p>
                  <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                    {formatPhone(item.userPhone)}
                  </p>
                </div>
                <input
                  type="radio"
                  name="link-user-mobile"
                  checked={selected}
                  onChange={() => onSelectUser(item.id)}
                  aria-label={`Selecionar ${item.userName}`}
                  className="mt-1 size-4 shrink-0 accent-primary"
                />
              </div>
              <Button
                type="button"
                className="mt-3 w-full"
                variant={selected ? "default" : "outline"}
                size="sm"
                onClick={() => onSelectUser(item.id)}
              >
                {selected ? "Selecionado" : "Selecionar"}
              </Button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
