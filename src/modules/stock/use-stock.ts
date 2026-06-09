"use client"

import { useQuery } from "@tanstack/react-query"

import {
  listStockBatchBalancesService,
  listStockBatchesService,
  listStockLocationsService,
  listStockMinMaxService,
  listStockMovementsService,
  listStockSectorRentalsService,
  listStockSectorsService,
} from "@/modules/stock/stock.service"
import type {
  ListStockMovementsQuery,
  PaginationQuery,
} from "@/modules/stock/stock.schema"

const STOCK_STALE_TIME = 0

export const stockQueryKeys = {
  all: ["stock"] as const,
  sectors: (filters?: PaginationQuery) =>
    ["stock", "sectors", filters ?? {}] as const,
  locations: (filters?: PaginationQuery) =>
    ["stock", "locations", filters ?? {}] as const,
  batches: (filters?: PaginationQuery) =>
    ["stock", "batches", filters ?? {}] as const,
  sectorRentals: (filters?: PaginationQuery) =>
    ["stock", "sector-rentals", filters ?? {}] as const,
  batchBalances: (filters?: PaginationQuery) =>
    ["stock", "batch-balances", filters ?? {}] as const,
  minMax: (filters?: PaginationQuery) =>
    ["stock", "min-max", filters ?? {}] as const,
  movements: (filters?: ListStockMovementsQuery) =>
    ["stock", "movements", filters ?? {}] as const,
}

type ListHookOptions = {
  filters?: PaginationQuery | ListStockMovementsQuery
  enabled?: boolean
}

export function useStockSectorsQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  return useQuery({
    queryKey: stockQueryKeys.sectors(filters),
    queryFn: () => listStockSectorsService(filters),
    enabled,
    staleTime: STOCK_STALE_TIME,
  })
}

export function useStockLocationsQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  return useQuery({
    queryKey: stockQueryKeys.locations(filters),
    queryFn: () => listStockLocationsService(filters),
    enabled,
    staleTime: STOCK_STALE_TIME,
  })
}

export function useStockBatchesQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  return useQuery({
    queryKey: stockQueryKeys.batches(filters),
    queryFn: () => listStockBatchesService(filters),
    enabled,
    staleTime: STOCK_STALE_TIME,
  })
}

export function useStockSectorRentalsQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  return useQuery({
    queryKey: stockQueryKeys.sectorRentals(filters),
    queryFn: () => listStockSectorRentalsService(filters),
    enabled,
    staleTime: STOCK_STALE_TIME,
  })
}

export function useStockBatchBalancesQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  return useQuery({
    queryKey: stockQueryKeys.batchBalances(filters),
    queryFn: () => listStockBatchBalancesService(filters),
    enabled,
    staleTime: STOCK_STALE_TIME,
  })
}

export function useStockMinMaxQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  return useQuery({
    queryKey: stockQueryKeys.minMax(filters),
    queryFn: () => listStockMinMaxService(filters),
    enabled,
    staleTime: STOCK_STALE_TIME,
  })
}

export function useStockMovementsQuery({
  filters = {},
  enabled = true,
}: ListHookOptions = {}) {
  return useQuery({
    queryKey: stockQueryKeys.movements(filters as ListStockMovementsQuery),
    queryFn: () =>
      listStockMovementsService(filters as ListStockMovementsQuery),
    enabled,
    staleTime: STOCK_STALE_TIME,
  })
}
