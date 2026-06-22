import { fetchAllPages } from "@/lib/api/fetch-all-pages"
import type { ProductEnterpriseListLookups } from "@/modules/products/products-list-display"
import {
  getProductBrandService,
  getProductGroupService,
  getProductSubgroupService,
  listProductApplicationsService,
  listProductBrandsService,
  listProductGroupsService,
  listProductSubgroupsService,
} from "@/modules/products/products.service"
import {
  listStockBatchBalancesService,
  listStockBatchesService,
  listStockLocationsService,
  listStockSectorRentalsService,
} from "@/modules/stock/stock.service"

const PAGE_SIZE = 100
const MAX_PAGES = 50

async function fetchAllCatalogPages<T>(
  fetchPage: (offset: number, limit: number) => Promise<{
    items: T[]
    total: number
    limit: number
    offset: number
  }>
): Promise<T[]> {
  const { items } = await fetchAllPages({
    pageSize: PAGE_SIZE,
    maxPages: MAX_PAGES,
    fetchPage,
  })
  return items
}

async function tryFetchAllCatalogPages<T>(
  fetchPage: (offset: number, limit: number) => Promise<{
    items: T[]
    total: number
    limit: number
    offset: number
  }>
): Promise<T[]> {
  try {
    return await fetchAllCatalogPages(fetchPage)
  } catch {
    return []
  }
}

async function fetchCatalogItemsByIds<T extends { id: string }>(
  ids: string[],
  fetchOne: (id: string) => Promise<T>
): Promise<T[]> {
  if (ids.length === 0) return []

  const settled = await Promise.allSettled(ids.map((id) => fetchOne(id)))
  return settled
    .filter(
      (result): result is PromiseFulfilledResult<Awaited<T>> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value)
}

export type ProductsListLookupsOptions = {
  includeGroups: boolean
  includeSubgroups: boolean
  includeBrands: boolean
  includeApplications: boolean
  includeStock: boolean
  supplementalGroupIds?: string[]
  supplementalSubgroupIds?: string[]
  supplementalBrandIds?: string[]
  signal?: AbortSignal
}

export async function fetchProductsListLookups(
  options: ProductsListLookupsOptions
): Promise<ProductEnterpriseListLookups> {
  options.signal?.throwIfAborted()

  const [
    groups,
    subgroups,
    brands,
    applications,
    locations,
    sectorRentals,
    batchBalances,
    batches,
  ] = await Promise.all([
    options.includeGroups
      ? tryFetchAllCatalogPages((offset, limit) =>
          listProductGroupsService({ offset, limit })
        )
      : Promise.resolve([]),
    options.includeSubgroups
      ? tryFetchAllCatalogPages((offset, limit) =>
          listProductSubgroupsService({ offset, limit })
        )
      : Promise.resolve([]),
    options.includeBrands
      ? tryFetchAllCatalogPages((offset, limit) =>
          listProductBrandsService({ offset, limit })
        )
      : Promise.resolve([]),
    options.includeApplications
      ? tryFetchAllCatalogPages((offset, limit) =>
          listProductApplicationsService({ offset, limit })
        )
      : Promise.resolve([]),
    options.includeStock
      ? tryFetchAllCatalogPages((offset, limit) =>
          listStockLocationsService({ offset, limit })
        )
      : Promise.resolve([]),
    options.includeStock
      ? tryFetchAllCatalogPages((offset, limit) =>
          listStockSectorRentalsService({ offset, limit })
        )
      : Promise.resolve([]),
    options.includeStock
      ? tryFetchAllCatalogPages((offset, limit) =>
          listStockBatchBalancesService({ offset, limit })
        )
      : Promise.resolve([]),
    options.includeStock
      ? tryFetchAllCatalogPages((offset, limit) =>
          listStockBatchesService({ offset, limit })
        )
      : Promise.resolve([]),
  ])

  options.signal?.throwIfAborted()

  const [extraGroups, extraSubgroups, extraBrands] = await Promise.all([
    options.includeGroups
      ? fetchCatalogItemsByIds(
          options.supplementalGroupIds ?? [],
          getProductGroupService
        )
      : Promise.resolve([]),
    options.includeSubgroups
      ? fetchCatalogItemsByIds(
          options.supplementalSubgroupIds ?? [],
          getProductSubgroupService
        )
      : Promise.resolve([]),
    options.includeBrands
      ? fetchCatalogItemsByIds(
          options.supplementalBrandIds ?? [],
          getProductBrandService
        )
      : Promise.resolve([]),
  ])

  return {
    groups: mergeCatalogItems(groups, extraGroups),
    subgroups: mergeCatalogItems(subgroups, extraSubgroups),
    brands: mergeCatalogItems(brands, extraBrands),
    applications,
    locations,
    sectorRentals,
    batchBalances,
    batches,
  }
}

function mergeCatalogItems<T extends { id: string }>(
  base: T[],
  extra: T[]
): T[] {
  if (extra.length === 0) return base

  const merged = new Map(base.map((item) => [item.id, item]))
  for (const item of extra) {
    merged.set(item.id, item)
  }
  return [...merged.values()]
}
