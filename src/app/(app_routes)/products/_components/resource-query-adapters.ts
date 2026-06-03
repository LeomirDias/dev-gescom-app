"use client"

import {
  useIcmsTaxationItemQuery,
  usePisCofinsSituationItemQuery,
  usePriceQuery,
  useProductAnpQuery,
  useProductApplicationQuery,
  useProductBrandQuery,
  useProductCestQuery,
  useProductGroupQuery,
  useProductNbsQuery,
  useProductNcmQuery,
  useProductQuery,
  useProductSubgroupQuery,
  useProductTaxationQuery,
  usePromotionalPriceQuery,
  useTypeProductQuery,
  useUnitQuery,
} from "@/modules/products/use-products"

type DetailQueryOpts = {
  id: string | undefined
  enabled: boolean
}

export function usePriceDetailData({ id, enabled }: DetailQueryOpts) {
  return usePriceQuery({ priceId: id, enabled })
}

export function usePromotionalPriceDetailData({ id, enabled }: DetailQueryOpts) {
  return usePromotionalPriceQuery({ promotionalPriceId: id, enabled })
}

export function useProductTaxationDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductTaxationQuery({ productTaxationId: id, enabled })
}

export function useProductApplicationDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductApplicationQuery({ applicationId: id, enabled })
}

export function useProductDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductQuery({ productId: id, enabled })
}

export function useUnitDetailData({ id, enabled }: DetailQueryOpts) {
  return useUnitQuery({ unitId: id, enabled })
}

export function useTypeProductDetailData({ id, enabled }: DetailQueryOpts) {
  return useTypeProductQuery({ typeProductId: id, enabled })
}

export function useProductNcmDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductNcmQuery({ productsNcmId: id, enabled })
}

export function useProductCestDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductCestQuery({ productsCestId: id, enabled })
}

export function useProductAnpDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductAnpQuery({ productsAnpId: id, enabled })
}

export function useProductNbsDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductNbsQuery({ productsNbsId: id, enabled })
}

export function useIcmsTaxationDetailData({ id, enabled }: DetailQueryOpts) {
  return useIcmsTaxationItemQuery({ icmsTaxationId: id, enabled })
}

export function useProductGroupDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductGroupQuery({ productGroupId: id, enabled })
}

export function useProductSubgroupDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductSubgroupQuery({ productSubgroupId: id, enabled })
}

export function useProductBrandDetailData({ id, enabled }: DetailQueryOpts) {
  return useProductBrandQuery({ productBrandId: id, enabled })
}

export function usePisCofinsSituationDetailData({ id, enabled }: DetailQueryOpts) {
  return usePisCofinsSituationItemQuery({ pisCofinsSituationId: id, enabled })
}
