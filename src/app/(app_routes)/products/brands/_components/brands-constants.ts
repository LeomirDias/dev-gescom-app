import type { PaginationQuery } from "@/modules/products/products-query"

export const BRANDS_CLIENT_SEARCH_LIMIT = 100

export type BrandsDraftFilters = {
  description: string
}

export function defaultBrandsDraftFilters(): BrandsDraftFilters {
  return { description: "" }
}

export function defaultBrandsFilters(): PaginationQuery {
  return { limit: 50, offset: 0 }
}

export const BRANDS_LABELS = {
  singular: "marca",
  plural: "marcas",
  loadListError: "Não foi possível carregar as marcas.",
  loadListErrorTitle: "Erro ao carregar marcas",
  emptyList: "Nenhuma marca encontrada",
  emptyListHint: "Ajuste os filtros ou refine a pesquisa.",
} as const
