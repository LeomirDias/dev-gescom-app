"use client"

import { ProductsList } from "@/app/(app_routes)/products/_components/products-list"
import { PRODUCTS_ROUTE_CONFIG } from "@/modules/products/products-route-config"

export default function ProductsPage() {
  return <ProductsList config={PRODUCTS_ROUTE_CONFIG} />
}
