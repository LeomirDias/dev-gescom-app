import type { PaginationQuery } from "@/modules/products/products-query"

export const NCM_CLIENT_SEARCH_LIMIT = 100

export type NcmDraftFilters = {
  ncm: string
  description: string
}

export function defaultNcmDraftFilters(): NcmDraftFilters {
  return { ncm: "", description: "" }
}

export function defaultNcmFilters(): PaginationQuery {
  return { limit: 50, offset: 0 }
}

export const NCM_LABELS = {
  singular: "NCM",
  plural: "NCM",
  loadListError: "Não foi possível carregar os códigos NCM.",
  loadListErrorTitle: "Erro ao carregar NCM",
  emptyList: "Nenhum código NCM encontrado",
  emptyListHint: "Ajuste os filtros ou refine a pesquisa.",
} as const
