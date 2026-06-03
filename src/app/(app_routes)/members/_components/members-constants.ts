import type { ListMembersQuery } from "@/modules/memberships/memberships.schema"

export const MEMBERS_BASE_PATH = "/members"
export const DEFAULT_MEMBERS_LIMIT = 50

export function defaultMembersListFilters(): ListMembersQuery {
  return {
    limit: DEFAULT_MEMBERS_LIMIT,
    offset: 0,
  }
}
