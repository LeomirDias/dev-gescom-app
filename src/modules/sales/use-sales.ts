"use client"

import { useQuery } from "@tanstack/react-query"

import {
  getPaymentTypeService,
  getSaleReturnService,
  getSaleService,
  listBudgetConversionsService,
  listPaymentTypesService,
  listSaleReturnsService,
  listSalesService,
} from "@/modules/sales/sales.service"
import type {
  ListPaymentTypesQuery,
  ListSalesQuery,
} from "@/modules/sales/sales.schema"

const SALES_STALE_TIME = 0

export const salesQueryKeys = {
  all: ["sales"] as const,
  list: (filters?: ListSalesQuery) => ["sales", "list", filters ?? {}] as const,
  detail: (id: string) => ["sales", "detail", id] as const,
  returns: (saleId: string) => ["sales", "returns", saleId] as const,
  returnDetail: (saleId: string, returnId: string) =>
    ["sales", "returns", saleId, returnId] as const,
  budgetConversions: (saleId: string) =>
    ["sales", "budget-conversions", saleId] as const,
  paymentTypes: (filters?: ListPaymentTypesQuery) =>
    ["sales", "payment-types", filters ?? {}] as const,
  paymentType: (id: string) => ["sales", "payment-types", id] as const,
}

export function useSalesQuery({
  filters,
  enabled = true,
}: {
  filters?: ListSalesQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.list(filters),
    queryFn: () => listSalesService(filters),
    enabled,
    staleTime: SALES_STALE_TIME,
  })
}

export function useSaleQuery({
  saleId,
  enabled = true,
}: {
  saleId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.detail(saleId),
    queryFn: () => getSaleService(saleId),
    enabled: enabled && Boolean(saleId),
    staleTime: SALES_STALE_TIME,
  })
}

export function useSaleReturnsQuery({
  saleId,
  enabled = true,
}: {
  saleId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.returns(saleId),
    queryFn: () => listSaleReturnsService(saleId),
    enabled: enabled && Boolean(saleId),
    staleTime: SALES_STALE_TIME,
  })
}

export function useSaleReturnQuery({
  saleId,
  returnId,
  enabled = true,
}: {
  saleId: string
  returnId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.returnDetail(saleId, returnId),
    queryFn: () => getSaleReturnService(saleId, returnId),
    enabled: enabled && Boolean(saleId) && Boolean(returnId),
    staleTime: SALES_STALE_TIME,
  })
}

export function useBudgetConversionsQuery({
  saleId,
  enabled = true,
}: {
  saleId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.budgetConversions(saleId),
    queryFn: () => listBudgetConversionsService(saleId),
    enabled: enabled && Boolean(saleId),
    staleTime: SALES_STALE_TIME,
  })
}

export function usePaymentTypesQuery({
  filters,
  enabled = true,
}: {
  filters?: ListPaymentTypesQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.paymentTypes(filters),
    queryFn: () => listPaymentTypesService(filters),
    enabled,
    staleTime: 5 * 60_000,
  })
}

export function usePaymentTypeQuery({
  paymentTypeId,
  enabled = true,
}: {
  paymentTypeId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.paymentType(paymentTypeId),
    queryFn: () => getPaymentTypeService(paymentTypeId),
    enabled: enabled && Boolean(paymentTypeId),
    staleTime: 5 * 60_000,
  })
}
