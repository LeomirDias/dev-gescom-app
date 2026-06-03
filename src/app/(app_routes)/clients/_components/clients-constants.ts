import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"

export const CLIENT_MEMBER_CLASS = "CLIENTE" as const
export const CLIENTS_BASE_PATH = "/clients"
export const DEFAULT_CLIENT_LIMIT = 50

export function defaultClientListFilters(): ListMembersQuery {
  return {
    class: CLIENT_MEMBER_CLASS,
    limit: DEFAULT_CLIENT_LIMIT,
    offset: 0,
  }
}
