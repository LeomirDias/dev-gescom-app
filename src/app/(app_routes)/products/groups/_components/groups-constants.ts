import type { PaginationQuery } from "@/modules/products/products-query"

export const GROUPS_CLIENT_SEARCH_LIMIT = 100

export type GroupsDraftFilters = {
  description: string
}

export function defaultGroupsDraftFilters(): GroupsDraftFilters {
  return { description: "" }
}

export function defaultGroupsFilters(): PaginationQuery {
  return { limit: 50, offset: 0 }
}

export const GROUPS_LABELS = {
  singular: "grupo",
  plural: "grupos",
  loadListError: "Não foi possível carregar os grupos.",
  loadListErrorTitle: "Erro ao carregar grupos",
  emptyList: "Nenhum grupo encontrado",
  emptyListHint: "Ajuste os filtros ou refine a pesquisa.",
} as const
