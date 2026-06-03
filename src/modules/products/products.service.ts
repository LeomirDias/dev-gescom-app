import { apiFetch } from "@/lib/api/client"
import { paginatedEnvelopeSchema, successEnvelopeSchema } from "@/lib/api/envelope"
import {
  icmsTaxationSchema,
  listProductNbsQuerySchema,
  pisCofinsSituationSchema,
  productAnpSchema,
  productBrandSchema,
  productCestSchema,
  productGroupSchema,
  productNbsSchema,
  productNcmSchema,
  productSubgroupSchema,
  typeProductSchema,
  unitSchema,
} from "@/modules/products/products-catalogs.schema"
import { buildPaginationQuery } from "@/modules/products/products-query"
import {
  paginationQuerySchema,
  type PaginationQuery,
} from "@/modules/products/products-query"
import {
  priceSchema,
  productApplicationSchema,
  productTaxationSchema,
  promotionalPriceSchema,
} from "@/modules/products/products-tenant-extras.schema"
import {
  listProductsEnterprisesQuerySchema,
  listProductsQuerySchema,
  productEnterpriseSchema,
  productSchema,
} from "@/modules/products/products.schema"

async function listPaginated<T extends { id: string }>(
  path: string,
  itemSchema: import("zod").ZodType<T>,
  query: PaginationQuery & { search?: string; status?: string } = {}
) {
  const parsed = paginationQuerySchema.parse(query)
  const qs = buildPaginationQuery({
    ...parsed,
    search: "search" in query ? query.search : undefined,
    status: "status" in query ? query.status : undefined,
  })
  const raw = await apiFetch<unknown>(`${path}${qs}`, { method: "GET" })
  const envelope = paginatedEnvelopeSchema(itemSchema).parse(raw)
  return { items: envelope.data, ...envelope.pagination }
}

async function getById<T>(path: string, itemSchema: import("zod").ZodType<T>) {
  const raw = await apiFetch<unknown>(path, { method: "GET" })
  return successEnvelopeSchema(itemSchema).parse(raw).data
}

// --- Global products ---

export async function listProductsService(
  query: import("@/modules/products/products.schema").ListProductsQuery = {}
) {
  const parsed = listProductsQuerySchema.parse(query)
  const qs = buildPaginationQuery(parsed)
  const raw = await apiFetch<unknown>(`products${qs}`, { method: "GET" })
  const envelope = paginatedEnvelopeSchema(productSchema).parse(raw)
  return { items: envelope.data, ...envelope.pagination }
}

export async function getProductService(productId: string) {
  return getById(`products/${productId}`, productSchema)
}

// --- Products enterprises (tenant) ---

export async function listProductsEnterprisesService(
  query: import("@/modules/products/products.schema").ListProductsEnterprisesQuery = {}
) {
  const parsed = listProductsEnterprisesQuerySchema.parse(query)
  const qs = buildPaginationQuery(parsed)
  const raw = await apiFetch<unknown>(`products-enterprises${qs}`, {
    method: "GET",
  })
  const envelope = paginatedEnvelopeSchema(productEnterpriseSchema).parse(raw)
  return { items: envelope.data, ...envelope.pagination }
}

export async function getProductEnterpriseService(productEnterpriseId: string) {
  return getById(
    `products-enterprises/${productEnterpriseId}`,
    productEnterpriseSchema
  )
}

// --- Tenant extras ---

export async function listPricesService(query: PaginationQuery = {}) {
  return listPaginated("prices", priceSchema, query)
}

export async function getPriceService(priceId: string) {
  return getById(`prices/${priceId}`, priceSchema)
}

export async function listPromotionalPricesService(query: PaginationQuery = {}) {
  return listPaginated("promotional-prices", promotionalPriceSchema, query)
}

export async function getPromotionalPriceService(promotionalPriceId: string) {
  return getById(`promotional-prices/${promotionalPriceId}`, promotionalPriceSchema)
}

export async function listProductTaxationService(query: PaginationQuery = {}) {
  return listPaginated("product-taxation", productTaxationSchema, query)
}

export async function getProductTaxationService(productTaxationId: string) {
  return getById(`product-taxation/${productTaxationId}`, productTaxationSchema)
}

export async function listProductApplicationsService(query: PaginationQuery = {}) {
  return listPaginated("product-applications", productApplicationSchema, query)
}

export async function getProductApplicationService(id: string) {
  return getById(`product-applications/${id}`, productApplicationSchema)
}

// --- Global catalogs ---

export async function listUnitsService(query: PaginationQuery = {}) {
  return listPaginated("units", unitSchema, query)
}

export async function getUnitService(unitId: string) {
  return getById(`units/${unitId}`, unitSchema)
}

export async function listTypesProductsService(query: PaginationQuery = {}) {
  return listPaginated("types-products", typeProductSchema, query)
}

export async function getTypeProductService(typeProductId: string) {
  return getById(`types-products/${typeProductId}`, typeProductSchema)
}

export async function listProductsNcmService(query: PaginationQuery = {}) {
  return listPaginated("products-ncm", productNcmSchema, query)
}

export async function getProductNcmService(productsNcmId: string) {
  return getById(`products-ncm/${productsNcmId}`, productNcmSchema)
}

export async function listProductsCestService(query: PaginationQuery = {}) {
  return listPaginated("products-cest", productCestSchema, query)
}

export async function getProductCestService(productsCestId: string) {
  return getById(`products-cest/${productsCestId}`, productCestSchema)
}

export async function listProductsAnpService(query: PaginationQuery = {}) {
  return listPaginated("products-anp", productAnpSchema, query)
}

export async function getProductAnpService(productsAnpId: string) {
  return getById(`products-anp/${productsAnpId}`, productAnpSchema)
}

export async function listProductsNbsService(
  query: import("@/modules/products/products-catalogs.schema").ListProductNbsQuery = {}
) {
  const parsed = listProductNbsQuerySchema.parse(query)
  const qs = buildPaginationQuery(parsed)
  const raw = await apiFetch<unknown>(`products-nbs${qs}`, { method: "GET" })
  const envelope = paginatedEnvelopeSchema(productNbsSchema).parse(raw)
  return { items: envelope.data, ...envelope.pagination }
}

export async function getProductNbsService(productsNbsId: string) {
  return getById(`products-nbs/${productsNbsId}`, productNbsSchema)
}

export async function listIcmsTaxationService(query: PaginationQuery = {}) {
  return listPaginated("icms-taxation", icmsTaxationSchema, query)
}

export async function getIcmsTaxationService(icmsTaxationId: string) {
  return getById(`icms-taxation/${icmsTaxationId}`, icmsTaxationSchema)
}

export async function listProductGroupsService(query: PaginationQuery = {}) {
  return listPaginated("product-groups", productGroupSchema, query)
}

export async function getProductGroupService(productGroupId: string) {
  return getById(`product-groups/${productGroupId}`, productGroupSchema)
}

export async function listProductSubgroupsService(query: PaginationQuery = {}) {
  return listPaginated("product-subgroups", productSubgroupSchema, query)
}

export async function getProductSubgroupService(productSubgroupId: string) {
  return getById(`product-subgroups/${productSubgroupId}`, productSubgroupSchema)
}

export async function listProductBrandsService(query: PaginationQuery = {}) {
  return listPaginated("product-brands", productBrandSchema, query)
}

export async function getProductBrandService(productBrandId: string) {
  return getById(`product-brands/${productBrandId}`, productBrandSchema)
}

export async function listPisCofinsSituationService(query: PaginationQuery = {}) {
  return listPaginated("pis-cofins-situation", pisCofinsSituationSchema, query)
}

export async function getPisCofinsSituationService(pisCofinsSituationId: string) {
  return getById(`pis-cofins-situation/${pisCofinsSituationId}`, pisCofinsSituationSchema)
}
