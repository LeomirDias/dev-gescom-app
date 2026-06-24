"use client"

import { MembersTableRows } from "@/app/(app_routes)/members/_components/members-table-rows"
import type { MemberListItem } from "@/modules/memberships/memberships.schema"

type ClientsTableRowsProps = {
  items: MemberListItem[]
  onView: (memberId: string) => void
}

export function ClientsTableRows({ items, onView }: ClientsTableRowsProps) {
  return (
    <MembersTableRows
      items={items}
      pluralLabel="clientes"
      showClassColumn={false}
      onView={onView}
    />
  )
}
