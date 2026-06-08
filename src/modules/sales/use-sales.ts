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
  list: (enterpriseId: string, filters?: ListSalesQuery) =>
    ["sales", enterpriseId, "list", filters ?? {}] as const,
  detail: (enterpriseId: string, id: string) =>
    ["sales", enterpriseId, "detail", id] as const,
  returns: (enterpriseId: string, saleId: string) =>
    ["sales", enterpriseId, "returns", saleId] as const,
  returnDetail: (enterpriseId: string, saleId: string, returnId: string) =>
    ["sales", enterpriseId, "returns", saleId, returnId] as const,
  budgetConversions: (enterpriseId: string, saleId: string) =>
    ["sales", enterpriseId, "budget-conversions", saleId] as const,
  paymentTypes: (enterpriseId: string, filters?: ListPaymentTypesQuery) =>
    ["sales", enterpriseId, "payment-types", filters ?? {}] as const,
  paymentType: (enterpriseId: string, id: string) =>
    ["sales", enterpriseId, "payment-types", id] as const,
}

export function useSalesQuery({
  enterpriseId,
  filters,
  enabled = true,
}: {
  enterpriseId: string | undefined
  filters?: ListSalesQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.list(enterpriseId ?? "", filters),
    queryFn: () => listSalesService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: SALES_STALE_TIME,
  })
}

export function useSaleQuery({
  enterpriseId,
  saleId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  saleId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.detail(enterpriseId ?? "", saleId),
    queryFn: () => getSaleService(saleId),
    enabled: enabled && Boolean(enterpriseId) && Boolean(saleId),
    staleTime: SALES_STALE_TIME,
  })
}

export function useSaleReturnsQuery({
  enterpriseId,
  saleId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  saleId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.returns(enterpriseId ?? "", saleId),
    queryFn: () => listSaleReturnsService(saleId),
    enabled: enabled && Boolean(enterpriseId) && Boolean(saleId),
    staleTime: SALES_STALE_TIME,
  })
}

export function useSaleReturnQuery({
  enterpriseId,
  saleId,
  returnId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  saleId: string
  returnId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.returnDetail(enterpriseId ?? "", saleId, returnId),
    queryFn: () => getSaleReturnService(saleId, returnId),
    enabled:
      enabled && Boolean(enterpriseId) && Boolean(saleId) && Boolean(returnId),
    staleTime: SALES_STALE_TIME,
  })
}

export function useBudgetConversionsQuery({
  enterpriseId,
  saleId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  saleId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.budgetConversions(enterpriseId ?? "", saleId),
    queryFn: () => listBudgetConversionsService(saleId),
    enabled: enabled && Boolean(enterpriseId) && Boolean(saleId),
    staleTime: SALES_STALE_TIME,
  })
}

export function usePaymentTypesQuery({
  enterpriseId,
  filters,
  enabled = true,
}: {
  enterpriseId: string | undefined
  filters?: ListPaymentTypesQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.paymentTypes(enterpriseId ?? "", filters),
    queryFn: () => listPaymentTypesService(filters),
    enabled: enabled && Boolean(enterpriseId),
    staleTime: 5 * 60_000,
  })
}

export function usePaymentTypeQuery({
  enterpriseId,
  paymentTypeId,
  enabled = true,
}: {
  enterpriseId: string | undefined
  paymentTypeId: string
  enabled?: boolean
}) {
  return useQuery({
    queryKey: salesQueryKeys.paymentType(enterpriseId ?? "", paymentTypeId),
    queryFn: () => getPaymentTypeService(paymentTypeId),
    enabled: enabled && Boolean(enterpriseId) && Boolean(paymentTypeId),
    staleTime: 5 * 60_000,
  })
}
