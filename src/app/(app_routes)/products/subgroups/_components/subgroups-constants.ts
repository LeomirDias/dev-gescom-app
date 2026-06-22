import type { PaginationQuery } from "@/modules/products/products-query"

export const SUBGROUPS_CLIENT_SEARCH_LIMIT = 100

export type SubgroupsDraftFilters = {
  description: string
}

export function defaultSubgroupsDraftFilters(): SubgroupsDraftFilters {
  return { description: "" }
}

export function defaultSubgroupsFilters(): PaginationQuery {
  return { limit: 50, offset: 0 }
}

export const SUBGROUPS_LABELS = {
  singular: "subgrupo",
  plural: "subgrupos",
  loadListError: "Não foi possível carregar os subgrupos.",
  loadListErrorTitle: "Erro ao carregar subgrupos",
  emptyList: "Nenhum subgrupo encontrado",
  emptyListHint: "Ajuste os filtros ou refine a pesquisa.",
} as const
