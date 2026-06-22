"use client"

import { useMemo } from "react"

import {
  ProductEnterpriseFieldCards,
  ProductEnterpriseRegistrationCard,
  ProductPriceSection,
} from "@/app/(app_routes)/products/_components/product-enterprise-field"
import type { ProductEnterprise } from "@/modules/products/products.schema"
import type { Price } from "@/modules/products/products-tenant-extras.schema"

type ProductDetailViewProps = {
  product: ProductEnterprise
  price?: Price
  canConsultPrices?: boolean
}

export function ProductDetailView({
  product,
  price,
  canConsultPrices = false,
}: ProductDetailViewProps) {
  return (
    <div className="space-y-6">
      <ProductEnterpriseRegistrationCard product={product} />
      <div className="grid gap-6 sm:grid-cols-2">
        <ProductEnterpriseFieldCards product={product} />
        <ProductPriceSection price={price} canConsult={canConsultPrices} />
      </div>
    </div>
  )
}

export function useProductPriceForEnterprise(
  prices: { items: Price[] } | undefined,
  productEnterpriseId: string | undefined
) {
  return useMemo(
    () =>
      prices?.items.find((p) => p.productsEnterprisesId === productEnterpriseId),
    [prices, productEnterpriseId]
  )
}
