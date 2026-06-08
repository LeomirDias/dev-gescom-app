import type { QueryClient } from "@tanstack/react-query"

const TENANT_QUERY_ROOTS = new Set([
  "sales",
  "sales-analytics",
  "products",
  "memberships",
  "users",
  "enterprises",
  "departments",
])

export function clearTenantQueries(queryClient: QueryClient) {
  queryClient.removeQueries({
    predicate: (query) => {
      const root = query.queryKey[0]
      return typeof root === "string" && TENANT_QUERY_ROOTS.has(root)
    },
  })
}
