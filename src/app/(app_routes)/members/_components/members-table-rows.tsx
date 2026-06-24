"use client"

import type { KeyboardEvent } from "react"

import { formatCpfCnpj, formatPhone } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { MemberListItem } from "@/modules/memberships/memberships.schema"
import { StatusBadge } from "@/components/global/returns/status-badge"
import { MemberClassBadge } from "./member-class-badge"

type MembersTableRowsProps = {
  items: MemberListItem[]
  pluralLabel: string
  showClassColumn?: boolean
  onView: (memberId: string) => void
}

export function MembersTableRows({
  items,
  pluralLabel,
  showClassColumn = true,
  onView,
}: MembersTableRowsProps) {
  const listLabel = `Lista de ${pluralLabel}`

  function handleRowKeyDown(
    event: KeyboardEvent<HTMLTableRowElement>,
    memberId: string
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onView(memberId)
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
                Nome
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                CPF/CNPJ
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                E-mail
              </th>
              <th scope="col" className="px-4 py-3 font-medium">
                Telefone
              </th>
              {showClassColumn && (
                <th scope="col" className="px-4 py-3 font-medium">
                  Classe
                </th>
              )}
              <th scope="col" className="px-4 py-3 font-medium">
                Status
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
                aria-label={`Ver detalhes de ${item.user.userName}`}
                onKeyDown={(event) => handleRowKeyDown(event, item.id)}
              >
                <td className="px-4 py-3 font-mono text-xs tabular-nums">
                  {item.code ?? "—"}
                </td>
                <td className="px-4 py-3 font-medium">{item.user.userName}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-muted-foreground">
                  {formatCpfCnpj(item.user.userRegistration)}
                </td>
                <td className="max-w-[200px] px-4 py-3">
                  <span
                    className="block truncate text-muted-foreground"
                    title={item.user.userEmail}
                  >
                    {item.user.userEmail}
                  </span>
                </td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {formatPhone(item.user.userPhone)}
                </td>
                {showClassColumn && (
                  <td className="px-4 py-3">
                    <MemberClassBadge memberClass={item.class} />
                  </td>
                )}
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
