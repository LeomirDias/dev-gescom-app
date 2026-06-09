import type { PaginationQuery } from "@/modules/stock/stock.schema"

export type StockResourceSlug =
  | "sectors"
  | "locations"
  | "batches"
  | "sector-rentals"
  | "batch-balances"
  | "min-max"
  | "movements"

export type StockResourceConfig = {
  slug: StockResourceSlug
  title: string
  description: string
  permissionLabel: string
  permissionKey:
    | "canConsultStockSectors"
    | "canConsultStockLocations"
    | "canConsultStockBatches"
    | "canConsultStockBalances"
    | "canConsultStockBatchBalances"
    | "canConsultStockMinMax"
    | "canConsultStockMovements"
  basePath: string
}

export const STOCK_RESOURCE_CONFIGS: StockResourceConfig[] = [
  {
    slug: "sectors",
    title: "Setores de estoque",
    description: "Áreas lógicas de armazém",
    permissionLabel: "consultar_setores_estoque",
    permissionKey: "canConsultStockSectors",
    basePath: "/stock/sectors",
  },
  {
    slug: "locations",
    title: "Locações físicas",
    description: "Posições físicas dentro dos setores",
    permissionLabel: "consultar_locacoes_estoque",
    permissionKey: "canConsultStockLocations",
    basePath: "/stock/locations",
  },
  {
    slug: "batches",
    title: "Lotes",
    description: "Cadastro de lotes por produto",
    permissionLabel: "consultar_lotes_estoque",
    permissionKey: "canConsultStockBatches",
    basePath: "/stock/batches",
  },
  {
    slug: "sector-rentals",
    title: "Saldos por locação",
    description: "Quantidade produto × locação (sem lote)",
    permissionLabel: "consultar_saldos_estoque",
    permissionKey: "canConsultStockBalances",
    basePath: "/stock/sector-rentals",
  },
  {
    slug: "batch-balances",
    title: "Saldos por lote",
    description: "Quantidade lote × locação",
    permissionLabel: "consultar_saldos_lote_estoque",
    permissionKey: "canConsultStockBatchBalances",
    basePath: "/stock/batch-balances",
  },
  {
    slug: "min-max",
    title: "Estoque mín/máx",
    description: "Limites por produto-empresa",
    permissionLabel: "consultar_estoque_min_max",
    permissionKey: "canConsultStockMinMax",
    basePath: "/stock/min-max",
  },
  {
    slug: "movements",
    title: "Movimentos",
    description: "Histórico de entradas e saídas",
    permissionLabel: "consultar_movimentos_estoque",
    permissionKey: "canConsultStockMovements",
    basePath: "/stock/movements",
  },
]

export const DEFAULT_STOCK_FILTERS: PaginationQuery = {
  limit: 50,
  offset: 0,
}

export function getStockResourceConfig(
  slug: StockResourceSlug
): StockResourceConfig {
  const config = STOCK_RESOURCE_CONFIGS.find((item) => item.slug === slug)
  if (!config) {
    throw new Error(`Configuração de estoque não encontrada: ${slug}`)
  }
  return config
}
