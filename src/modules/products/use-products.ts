"use client"

import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/components/providers/authentication/auth-store"
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

function useActiveEnterpriseId() {
  const { activeEnterprise } = useAuth()
  return activeEnterprise?.id
}

export const productsQueryKeys = {
  all: ["products"] as const,
  products: (enterpriseId: string, filters?: ListProductsQuery) =>
    ["products", enterpriseId, "global", filters ?? {}] as const,
  product: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "global", id] as const,
  enterprises: (enterpriseId: string, filters?: ListProductsEnterprisesQuery) =>
    ["products", enterpriseId, "enterprises", filters ?? {}] as const,
  enterprise: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "enterprises", id] as const,
  prices: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "prices", filters ?? {}] as const,
  price: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "prices", id] as const,
  promotionalPrices: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "promotional-prices", filters ?? {}] as const,
  promotionalPrice: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "promotional-prices", id] as const,
  taxation: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "taxation", filters ?? {}] as const,
  taxationItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "taxation", id] as const,
  applications: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "applications", filters ?? {}] as const,
  application: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "applications", id] as const,
  units: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "units", filters ?? {}] as const,
  unit: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "units", id] as const,
  types: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "types", filters ?? {}] as const,
  type: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "types", id] as const,
  ncm: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "ncm", filters ?? {}] as const,
  ncmItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "ncm", id] as const,
  cest: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "cest", filters ?? {}] as const,
  cestItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "cest", id] as const,
  anp: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "anp", filters ?? {}] as const,
  anpItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "anp", id] as const,
  nbs: (enterpriseId: string, filters?: ListProductNbsQuery) =>
    ["products", enterpriseId, "catalogs", "nbs", filters ?? {}] as const,
  nbsItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "nbs", id] as const,
  icms: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "icms", filters ?? {}] as const,
  icmsItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "icms", id] as const,
  groups: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "groups", filters ?? {}] as const,
  group: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "groups", id] as const,
  subgroups: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "subgroups", filters ?? {}] as const,
  subgroup: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "subgroups", id] as const,
  brands: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "brands", filters ?? {}] as const,
  brand: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "brands", id] as const,
  pisCofins: (enterpriseId: string, filters?: PaginationQuery) =>
    ["products", enterpriseId, "catalogs", "pis-cofins", filters ?? {}] as const,
  pisCofinsItem: (enterpriseId: string, id: string) =>
    ["products", enterpriseId, "catalogs", "pis-cofins", id] as const,
}

export function useProductsQuery({
  filters = {},
  enabled = true,
}: {
  filters?: ListProductsQuery
  enabled?: boolean
}) {
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.products(enterpriseId ?? "", filters),
    queryFn: () => listProductsService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.product(enterpriseId ?? "", productId ?? ""),
    queryFn: () => getProductService(productId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(productId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.enterprises(enterpriseId ?? "", filters),
    queryFn: () => listProductsEnterprisesService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.enterprise(
      enterpriseId ?? "",
      productEnterpriseId ?? ""
    ),
    queryFn: () => getProductEnterpriseService(productEnterpriseId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(productEnterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.prices(enterpriseId ?? "", filters),
    queryFn: () => listPricesService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.price(enterpriseId ?? "", priceId ?? ""),
    queryFn: () => getPriceService(priceId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(priceId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.promotionalPrices(enterpriseId ?? "", filters),
    queryFn: () => listPromotionalPricesService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.promotionalPrice(
      enterpriseId ?? "",
      promotionalPriceId ?? ""
    ),
    queryFn: () => getPromotionalPriceService(promotionalPriceId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(promotionalPriceId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.taxation(enterpriseId ?? "", filters),
    queryFn: () => listProductTaxationService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.taxationItem(
      enterpriseId ?? "",
      productTaxationId ?? ""
    ),
    queryFn: () => getProductTaxationService(productTaxationId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(productTaxationId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.applications(enterpriseId ?? "", filters),
    queryFn: () => listProductApplicationsService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.application(
      enterpriseId ?? "",
      applicationId ?? ""
    ),
    queryFn: () => getProductApplicationService(applicationId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(applicationId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.units(enterpriseId ?? "", filters),
    queryFn: () => listUnitsService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.unit(enterpriseId ?? "", unitId ?? ""),
    queryFn: () => getUnitService(unitId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(unitId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.types(enterpriseId ?? "", filters),
    queryFn: () => listTypesProductsService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.type(enterpriseId ?? "", typeProductId ?? ""),
    queryFn: () => getTypeProductService(typeProductId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(typeProductId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.ncm(enterpriseId ?? "", filters),
    queryFn: () => listProductsNcmService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.ncmItem(enterpriseId ?? "", productsNcmId ?? ""),
    queryFn: () => getProductNcmService(productsNcmId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(productsNcmId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.cest(enterpriseId ?? "", filters),
    queryFn: () => listProductsCestService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.cestItem(
      enterpriseId ?? "",
      productsCestId ?? ""
    ),
    queryFn: () => getProductCestService(productsCestId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(productsCestId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.anp(enterpriseId ?? "", filters),
    queryFn: () => listProductsAnpService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.anpItem(enterpriseId ?? "", productsAnpId ?? ""),
    queryFn: () => getProductAnpService(productsAnpId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(productsAnpId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.nbs(enterpriseId ?? "", filters),
    queryFn: () => listProductsNbsService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.nbsItem(enterpriseId ?? "", productsNbsId ?? ""),
    queryFn: () => getProductNbsService(productsNbsId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(productsNbsId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.icms(enterpriseId ?? "", filters),
    queryFn: () => listIcmsTaxationService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.icmsItem(
      enterpriseId ?? "",
      icmsTaxationId ?? ""
    ),
    queryFn: () => getIcmsTaxationService(icmsTaxationId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(icmsTaxationId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.groups(enterpriseId ?? "", filters),
    queryFn: () => listProductGroupsService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.group(enterpriseId ?? "", productGroupId ?? ""),
    queryFn: () => getProductGroupService(productGroupId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(productGroupId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.subgroups(enterpriseId ?? "", filters),
    queryFn: () => listProductSubgroupsService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.subgroup(
      enterpriseId ?? "",
      productSubgroupId ?? ""
    ),
    queryFn: () => getProductSubgroupService(productSubgroupId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(productSubgroupId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.brands(enterpriseId ?? "", filters),
    queryFn: () => listProductBrandsService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.brand(enterpriseId ?? "", productBrandId ?? ""),
    queryFn: () => getProductBrandService(productBrandId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(productBrandId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.pisCofins(enterpriseId ?? "", filters),
    queryFn: () => listPisCofinsSituationService(filters),
    enabled: enabled && Boolean(enterpriseId),
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
  const enterpriseId = useActiveEnterpriseId()
  return useQuery({
    queryKey: productsQueryKeys.pisCofinsItem(
      enterpriseId ?? "",
      pisCofinsSituationId ?? ""
    ),
    queryFn: () => getPisCofinsSituationService(pisCofinsSituationId!),
    enabled: enabled && Boolean(enterpriseId) && Boolean(pisCofinsSituationId),
    staleTime: CATALOG_STALE_TIME,
  })
}
