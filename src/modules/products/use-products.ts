"use client"

import { useQuery } from "@tanstack/react-query"
import type { ListProductNbsQuery } from "@/modules/products/products-catalogs.schema"
import type { PaginationQuery } from "@/modules/products/products-query"
import {
  getIcmsTaxationService,
  getPriceService,
  getProductAnpService,
  getProductApplicationService,
  getProductBrandService,
  getProductCestService,
  getProductEnterpriseService,
  getProductGroupService,
  getProductNbsService,
  getProductNcmService,
  getProductService,
  getProductSubgroupService,
  getProductTaxationService,
  getPromotionalPriceService,
  getPisCofinsSituationService,
  getTypeProductService,
  getUnitService,
  listIcmsTaxationService,
  listPisCofinsSituationService,
  listPricesService,
  listProductApplicationsService,
  listProductBrandsService,
  listProductGroupsService,
  listProductSubgroupsService,
  listProductTaxationService,
  listProductsAnpService,
  listProductsCestService,
  listProductsEnterprisesService,
  listProductsNbsService,
  listProductsNcmService,
  listProductsService,
  listPromotionalPricesService,
  listTypesProductsService,
  listUnitsService,
} from "@/modules/products/products.service"
import type {
  ListProductsEnterprisesQuery,
  ListProductsQuery,
} from "@/modules/products/products.schema"

const CATALOG_STALE_TIME = 5 * 60_000
const TENANT_STALE_TIME = 0

export const productsQueryKeys = {
  all: ["products"] as const,
  products: (filters?: ListProductsQuery) =>
    ["products", "global", filters ?? {}] as const,
  product: (id: string) => ["products", "global", id] as const,
  enterprises: (filters?: ListProductsEnterprisesQuery) =>
    ["products", "enterprises", filters ?? {}] as const,
  enterprise: (id: string) => ["products", "enterprises", id] as const,
  prices: (filters?: PaginationQuery) =>
    ["products", "prices", filters ?? {}] as const,
  price: (id: string) => ["products", "prices", id] as const,
  promotionalPrices: (filters?: PaginationQuery) =>
    ["products", "promotional-prices", filters ?? {}] as const,
  promotionalPrice: (id: string) =>
    ["products", "promotional-prices", id] as const,
  taxation: (filters?: PaginationQuery) =>
    ["products", "taxation", filters ?? {}] as const,
  taxationItem: (id: string) => ["products", "taxation", id] as const,
  applications: (filters?: PaginationQuery) =>
    ["products", "applications", filters ?? {}] as const,
  application: (id: string) => ["products", "applications", id] as const,
  units: (filters?: PaginationQuery) =>
    ["products", "catalogs", "units", filters ?? {}] as const,
  unit: (id: string) => ["products", "catalogs", "units", id] as const,
  types: (filters?: PaginationQuery) =>
    ["products", "catalogs", "types", filters ?? {}] as const,
  type: (id: string) => ["products", "catalogs", "types", id] as const,
  ncm: (filters?: PaginationQuery) =>
    ["products", "catalogs", "ncm", filters ?? {}] as const,
  ncmItem: (id: string) => ["products", "catalogs", "ncm", id] as const,
  cest: (filters?: PaginationQuery) =>
    ["products", "catalogs", "cest", filters ?? {}] as const,
  cestItem: (id: string) => ["products", "catalogs", "cest", id] as const,
  anp: (filters?: PaginationQuery) =>
    ["products", "catalogs", "anp", filters ?? {}] as const,
  anpItem: (id: string) => ["products", "catalogs", "anp", id] as const,
  nbs: (filters?: ListProductNbsQuery) =>
    ["products", "catalogs", "nbs", filters ?? {}] as const,
  nbsItem: (id: string) => ["products", "catalogs", "nbs", id] as const,
  icms: (filters?: PaginationQuery) =>
    ["products", "catalogs", "icms", filters ?? {}] as const,
  icmsItem: (id: string) => ["products", "catalogs", "icms", id] as const,
  groups: (filters?: PaginationQuery) =>
    ["products", "catalogs", "groups", filters ?? {}] as const,
  group: (id: string) => ["products", "catalogs", "groups", id] as const,
  subgroups: (filters?: PaginationQuery) =>
    ["products", "catalogs", "subgroups", filters ?? {}] as const,
  subgroup: (id: string) => ["products", "catalogs", "subgroups", id] as const,
  brands: (filters?: PaginationQuery) =>
    ["products", "catalogs", "brands", filters ?? {}] as const,
  brand: (id: string) => ["products", "catalogs", "brands", id] as const,
  pisCofins: (filters?: PaginationQuery) =>
    ["products", "catalogs", "pis-cofins", filters ?? {}] as const,
  pisCofinsItem: (id: string) =>
    ["products", "catalogs", "pis-cofins", id] as const,
}

export function useProductsQuery({
  filters = {},
  enabled = true,
}: {
  filters?: ListProductsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.products(filters),
    queryFn: () => listProductsService(filters),
    enabled,
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductQuery({
  productId,
  enabled = true,
}: {
  productId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.product(productId ?? ""),
    queryFn: () => getProductService(productId!),
    enabled: enabled && Boolean(productId),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductsEnterprisesQuery({
  filters = {},
  enabled = true,
}: {
  filters?: ListProductsEnterprisesQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.enterprises(filters),
    queryFn: () => listProductsEnterprisesService(filters),
    enabled,
    staleTime: TENANT_STALE_TIME,
  })
}

export function useProductEnterpriseQuery({
  productEnterpriseId,
  enabled = true,
}: {
  productEnterpriseId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.enterprise(productEnterpriseId ?? ""),
    queryFn: () => getProductEnterpriseService(productEnterpriseId!),
    enabled: enabled && Boolean(productEnterpriseId),
    staleTime: TENANT_STALE_TIME,
  })
}

export function usePricesQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.prices(filters),
    queryFn: () => listPricesService(filters),
    enabled,
    staleTime: TENANT_STALE_TIME,
  })
}

export function usePriceQuery({
  priceId,
  enabled = true,
}: {
  priceId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.price(priceId ?? ""),
    queryFn: () => getPriceService(priceId!),
    enabled: enabled && Boolean(priceId),
    staleTime: TENANT_STALE_TIME,
  })
}

export function usePromotionalPricesQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.promotionalPrices(filters),
    queryFn: () => listPromotionalPricesService(filters),
    enabled,
    staleTime: TENANT_STALE_TIME,
  })
}

export function usePromotionalPriceQuery({
  promotionalPriceId,
  enabled = true,
}: {
  promotionalPriceId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.promotionalPrice(promotionalPriceId ?? ""),
    queryFn: () => getPromotionalPriceService(promotionalPriceId!),
    enabled: enabled && Boolean(promotionalPriceId),
    staleTime: TENANT_STALE_TIME,
  })
}

export function useProductTaxationListQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.taxation(filters),
    queryFn: () => listProductTaxationService(filters),
    enabled,
    staleTime: TENANT_STALE_TIME,
  })
}

export function useProductTaxationQuery({
  productTaxationId,
  enabled = true,
}: {
  productTaxationId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.taxationItem(productTaxationId ?? ""),
    queryFn: () => getProductTaxationService(productTaxationId!),
    enabled: enabled && Boolean(productTaxationId),
    staleTime: TENANT_STALE_TIME,
  })
}

export function useProductApplicationsQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.applications(filters),
    queryFn: () => listProductApplicationsService(filters),
    enabled,
    staleTime: TENANT_STALE_TIME,
  })
}

export function useProductApplicationQuery({
  applicationId,
  enabled = true,
}: {
  applicationId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.application(applicationId ?? ""),
    queryFn: () => getProductApplicationService(applicationId!),
    enabled: enabled && Boolean(applicationId),
    staleTime: TENANT_STALE_TIME,
  })
}

export function useUnitsQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.units(filters),
    queryFn: () => listUnitsService(filters),
    enabled,
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useUnitQuery({
  unitId,
  enabled = true,
}: {
  unitId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.unit(unitId ?? ""),
    queryFn: () => getUnitService(unitId!),
    enabled: enabled && Boolean(unitId),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useTypesProductsQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.types(filters),
    queryFn: () => listTypesProductsService(filters),
    enabled,
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useTypeProductQuery({
  typeProductId,
  enabled = true,
}: {
  typeProductId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.type(typeProductId ?? ""),
    queryFn: () => getTypeProductService(typeProductId!),
    enabled: enabled && Boolean(typeProductId),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductsNcmQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.ncm(filters),
    queryFn: () => listProductsNcmService(filters),
    enabled,
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductNcmQuery({
  productsNcmId,
  enabled = true,
}: {
  productsNcmId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.ncmItem(productsNcmId ?? ""),
    queryFn: () => getProductNcmService(productsNcmId!),
    enabled: enabled && Boolean(productsNcmId),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductsCestQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.cest(filters),
    queryFn: () => listProductsCestService(filters),
    enabled,
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductCestQuery({
  productsCestId,
  enabled = true,
}: {
  productsCestId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.cestItem(productsCestId ?? ""),
    queryFn: () => getProductCestService(productsCestId!),
    enabled: enabled && Boolean(productsCestId),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductsAnpQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.anp(filters),
    queryFn: () => listProductsAnpService(filters),
    enabled,
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductAnpQuery({
  productsAnpId,
  enabled = true,
}: {
  productsAnpId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.anpItem(productsAnpId ?? ""),
    queryFn: () => getProductAnpService(productsAnpId!),
    enabled: enabled && Boolean(productsAnpId),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductsNbsQuery({
  filters = {},
  enabled = true,
}: {
  filters?: ListProductNbsQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.nbs(filters),
    queryFn: () => listProductsNbsService(filters),
    enabled,
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductNbsQuery({
  productsNbsId,
  enabled = true,
}: {
  productsNbsId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.nbsItem(productsNbsId ?? ""),
    queryFn: () => getProductNbsService(productsNbsId!),
    enabled: enabled && Boolean(productsNbsId),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useIcmsTaxationQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.icms(filters),
    queryFn: () => listIcmsTaxationService(filters),
    enabled,
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useIcmsTaxationItemQuery({
  icmsTaxationId,
  enabled = true,
}: {
  icmsTaxationId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.icmsItem(icmsTaxationId ?? ""),
    queryFn: () => getIcmsTaxationService(icmsTaxationId!),
    enabled: enabled && Boolean(icmsTaxationId),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductGroupsQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.groups(filters),
    queryFn: () => listProductGroupsService(filters),
    enabled,
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductGroupQuery({
  productGroupId,
  enabled = true,
}: {
  productGroupId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.group(productGroupId ?? ""),
    queryFn: () => getProductGroupService(productGroupId!),
    enabled: enabled && Boolean(productGroupId),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductSubgroupsQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.subgroups(filters),
    queryFn: () => listProductSubgroupsService(filters),
    enabled,
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductSubgroupQuery({
  productSubgroupId,
  enabled = true,
}: {
  productSubgroupId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.subgroup(productSubgroupId ?? ""),
    queryFn: () => getProductSubgroupService(productSubgroupId!),
    enabled: enabled && Boolean(productSubgroupId),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductBrandsQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.brands(filters),
    queryFn: () => listProductBrandsService(filters),
    enabled,
    staleTime: CATALOG_STALE_TIME,
  })
}

export function useProductBrandQuery({
  productBrandId,
  enabled = true,
}: {
  productBrandId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.brand(productBrandId ?? ""),
    queryFn: () => getProductBrandService(productBrandId!),
    enabled: enabled && Boolean(productBrandId),
    staleTime: CATALOG_STALE_TIME,
  })
}

export function usePisCofinsSituationQuery({
  filters = {},
  enabled = true,
}: {
  filters?: PaginationQuery
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.pisCofins(filters),
    queryFn: () => listPisCofinsSituationService(filters),
    enabled,
    staleTime: CATALOG_STALE_TIME,
  })
}

export function usePisCofinsSituationItemQuery({
  pisCofinsSituationId,
  enabled = true,
}: {
  pisCofinsSituationId: string | undefined
  enabled?: boolean
}) {
  return useQuery({
    queryKey: productsQueryKeys.pisCofinsItem(pisCofinsSituationId ?? ""),
    queryFn: () => getPisCofinsSituationService(pisCofinsSituationId!),
    enabled: enabled && Boolean(pisCofinsSituationId),
    staleTime: CATALOG_STALE_TIME,
  })
}
