"use client"

import type { LucideIcon } from "lucide-react"
import {
  Layers,
  Percent,
  Receipt,
  Tag,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { StatusBadge } from "@/components/global/returns/status-badge"
import { formatCurrency, formatDateOnly } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import type { ProductEnterprise } from "@/modules/products/products.schema"
import type {
  Price,
  ProductApplication,
  ProductTaxation,
  PromotionalPrice,
} from "@/modules/products/products-tenant-extras.schema"
import {
  useProductAnpQuery,
  useProductBrandQuery,
  useProductCestQuery,
  useProductGroupQuery,
  useProductNbsQuery,
  useProductNcmQuery,
  useProductSubgroupQuery,
  useTypeProductQuery,
  useUnitQuery,
} from "@/modules/products/use-products"

function formatFieldValue(
  value: string | number | null | undefined | boolean
): string {
  if (value === null || value === undefined || value === "") return "—"
  if (typeof value === "boolean") return value ? "Sim" : "Não"
  return String(value)
}

function formatCatalogLabel(
  primary: string | null | undefined,
  secondary: string | null | undefined
): string {
  const code = primary?.trim()
  const description = secondary?.trim()

  if (code && description) return `${code} — ${description}`
  return code ?? description ?? "—"
}

function ProductField({
  label,
  value,
  mono,
  className,
}: {
  label: string
  value: string | number | null | undefined | boolean
  mono?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          "mt-1 text-sm",
          mono && "font-mono tabular-nums text-foreground"
        )}
      >
        {formatFieldValue(value)}
      </dd>
    </div>
  )
}

function ProductAttributeCard({
  title,
  value,
  mono,
  children,
}: {
  title: string
  value?: string | number | null | boolean
  mono?: boolean
  children?: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children ?? (
          <p
            className={cn(
              "text-sm",
              mono && "font-mono tabular-nums text-foreground"
            )}
          >
            {formatFieldValue(value)}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function ProductSectionEmpty({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center border border-dashed border-border/80 bg-muted/20 px-6 py-10 text-center"
    >
      <Icon className="mb-3 size-9 text-muted-foreground/50" aria-hidden />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export function ProductEnterpriseRegistrationCard({
  product,
}: {
  product: ProductEnterprise
}) {
  return (
    <div className="bg-card p-4 border border-dashed border-gescom-secondary/40 flex flex-row gap-4 items-start justify-between">
      <div className="flex flex-col gap-4">
        <p className="text-2xl font-bold">{product.description} <span className="text-muted-foreground text-base">(#{product.code})</span></p>
        <p className="text-base text-muted-foreground">Número original: <span className="text-foreground">{product.origin}</span></p>
        <p className="text-base text-muted-foreground">Número do fabricante: <span className="text-foreground">{product.manufacturer}</span></p>
      </div>
      <p><StatusBadge status={product.status} /></p>
    </div>
  )
}

function MeasurementUnitFieldCard({ product }: { product: ProductEnterprise }) {
  const embedded = product.measurementUnit
  const { data } = useUnitQuery({
    unitId: product.measurementUnitId ?? undefined,
    enabled: !embedded && Boolean(product.measurementUnitId),
  })

  const value = embedded
    ? formatCatalogLabel(embedded.unit, embedded.description)
    : data
      ? formatCatalogLabel(data.unit, data.description)
      : null

  return <ProductAttributeCard title="Unidade de medida" value={value} />
}

function ProductTypeFieldCard({ product }: { product: ProductEnterprise }) {
  const embedded = product.productType
  const { data } = useTypeProductQuery({
    typeProductId: product.productTypeId ?? undefined,
    enabled: !embedded && Boolean(product.productTypeId),
  })

  const value = embedded
    ? formatCatalogLabel(embedded.type, embedded.description)
    : data
      ? formatCatalogLabel(data.type, data.description)
      : null

  return <ProductAttributeCard title="Tipo de produto" value={value} />
}

function ProductNcmFieldCard({ product }: { product: ProductEnterprise }) {
  const embedded = product.productNcm
  const { data } = useProductNcmQuery({
    productsNcmId: product.productNcmId ?? undefined,
    enabled: !embedded && Boolean(product.productNcmId),
  })

  const value = embedded
    ? formatCatalogLabel(embedded.ncm, embedded.description)
    : data
      ? formatCatalogLabel(data.ncm, data.description)
      : null

  return <ProductAttributeCard title="NCM" value={value} mono />
}

function ProductCestFieldCard({ product }: { product: ProductEnterprise }) {
  const embedded = product.productCest
  const { data } = useProductCestQuery({
    productsCestId: product.productCestId ?? undefined,
    enabled: !embedded && Boolean(product.productCestId),
  })

  const value = embedded
    ? formatCatalogLabel(embedded.cest, embedded.description)
    : data
      ? formatCatalogLabel(data.cest, data.description)
      : null

  return <ProductAttributeCard title="CEST" value={value} mono />
}

function ProductAnpFieldCard({ product }: { product: ProductEnterprise }) {
  const embedded = product.productAnp
  const { data } = useProductAnpQuery({
    productsAnpId: product.productAnpId ?? undefined,
    enabled: !embedded && Boolean(product.productAnpId),
  })

  const value = embedded
    ? formatCatalogLabel(embedded.anp, embedded.description)
    : data
      ? formatCatalogLabel(data.anp, data.description)
      : null

  return <ProductAttributeCard title="ANP" value={value} mono />
}

function ProductNbsFieldCard({ product }: { product: ProductEnterprise }) {
  const embedded = product.productNbs
  const { data } = useProductNbsQuery({
    productsNbsId: product.productNbsId ?? undefined,
    enabled: !embedded && Boolean(product.productNbsId),
  })

  const value = embedded
    ? formatCatalogLabel(embedded.nbs, embedded.description)
    : data
      ? formatCatalogLabel(data.nbs, data.description)
      : null

  return <ProductAttributeCard title="NBS" value={value} mono />
}

function ProductGroupFieldCard({ product }: { product: ProductEnterprise }) {
  const embedded = product.productGroup
  const { data } = useProductGroupQuery({
    productGroupId: product.productGroupId ?? undefined,
    enabled: !embedded?.description && Boolean(product.productGroupId),
  })

  const value = embedded?.description?.trim() || data?.description || null

  return <ProductAttributeCard title="Grupo" value={value} />
}

function ProductSubgroupFieldCard({ product }: { product: ProductEnterprise }) {
  const embedded = product.productSubgroup
  const { data } = useProductSubgroupQuery({
    productSubgroupId: product.productSubgroupId ?? undefined,
    enabled: !embedded?.description && Boolean(product.productSubgroupId),
  })

  const value = embedded?.description?.trim() || data?.description || null

  return <ProductAttributeCard title="Subgrupo" value={value} />
}

function ProductBrandFieldCard({ product }: { product: ProductEnterprise }) {
  const embedded = product.productBrand
  const { data } = useProductBrandQuery({
    productBrandId: product.productBrandId ?? undefined,
    enabled: !embedded?.description && Boolean(product.productBrandId),
  })

  const value = embedded?.description?.trim() || data?.description || null

  return <ProductAttributeCard title="Marca" value={value} />
}

export function ProductEnterpriseFieldCards({
  product,
}: {
  product: ProductEnterprise
}) {
  return (
    <>
      <ProductAttributeCard title="Código de barras" value={product.barCode} mono />
      <ProductAttributeCard
        title="Controla lote"
        value={product.controlsBatch}
      />
      <MeasurementUnitFieldCard product={product} />
      <ProductTypeFieldCard product={product} />
      <ProductNcmFieldCard product={product} />
      <ProductCestFieldCard product={product} />
      <ProductAnpFieldCard product={product} />
      <ProductNbsFieldCard product={product} />
      <ProductGroupFieldCard product={product} />
      <ProductSubgroupFieldCard product={product} />
      <ProductBrandFieldCard product={product} />
      <ProductAttributeCard title="Produto global" value={product.productId} mono />
      <ProductAttributeCard
        title="Criado em"
        value={formatDateOnly(product.createdAt)}
      />
      <ProductAttributeCard
        title="Atualizado em"
        value={formatDateOnly(product.updatedAt)}
      />
    </>
  )
}

/** @deprecated Use ProductEnterpriseRegistrationCard */
export const ProductDetailHeader = ProductEnterpriseRegistrationCard

/** @deprecated Use ProductEnterpriseRegistrationCard e ProductEnterpriseFieldCards */
export const ProductEnterpriseDetailsCard = ProductEnterpriseRegistrationCard

/** Mantido apenas para imports legados */
export const ProductEnterpriseInfoCard = ProductEnterpriseRegistrationCard

export function ProductPriceSection({
  price,
  canConsult,
}: {
  price: Price | undefined
  canConsult: boolean
}) {
  if (!canConsult) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Preço</CardTitle>
        <CardDescription>Valores de venda e custo</CardDescription>
      </CardHeader>
      <CardContent>
        {price ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground">
                Preço de venda
              </dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums">
                {formatCurrency(price.price)}
              </dd>
            </div>
            {price.priceCost != null && (
              <div>
                <dt className="text-xs font-medium tracking-wide text-muted-foreground">
                  Custo
                </dt>
                <dd className="mt-1 tabular-nums">
                  {formatCurrency(price.priceCost)}
                </dd>
              </div>
            )}
            {price.averageCost != null && (
              <div>
                <dt className="text-xs font-medium tracking-wide text-muted-foreground">
                  Custo médio
                </dt>
                <dd className="mt-1 tabular-nums">
                  {formatCurrency(price.averageCost)}
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <ProductSectionEmpty
            icon={Tag}
            title="Sem preço registrado"
            description="Não há preço de venda cadastrado para este produto."
          />
        )}
      </CardContent>
    </Card>
  )
}

export function ProductPromotionalPricesSection({
  items,
  canConsult,
}: {
  items: PromotionalPrice[]
  canConsult: boolean
}) {
  if (!canConsult) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Preços promocionais</CardTitle>
        <CardDescription>
          {items.length === 1
            ? "1 promoção cadastrada"
            : `${items.length} promoções cadastradas`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <ProductSectionEmpty
            icon={Percent}
            title="Nenhuma promoção ativa"
            description="Não há preços promocionais vigentes para este produto."
          />
        ) : (
          <ul className="space-y-2" aria-label="Preços promocionais">
            {items.map((promo, index) => (
              <li
                key={promo.id}
                className={cn(
                  "border bg-card p-4 shadow-sm",
                  index % 2 === 1 && "bg-muted/20"
                )}
              >
                <p className="font-medium tabular-nums">
                  {formatCurrency(promo.price)}
                </p>
                {promo.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {promo.description}
                  </p>
                )}
                <p className="mt-2 text-xs tabular-nums text-muted-foreground">
                  {formatDateOnly(promo.startDate)} –{" "}
                  {formatDateOnly(promo.endDate)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function ProductTaxationSection({
  items,
  canConsult,
}: {
  items: ProductTaxation[]
  canConsult: boolean
}) {
  if (!canConsult) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tributação</CardTitle>
        <CardDescription>Códigos CST de PIS e COFINS</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <ProductSectionEmpty
            icon={Receipt}
            title="Sem tributação registrada"
            description="Não há configuração fiscal vinculada a este produto."
          />
        ) : (
          <ul className="space-y-2" aria-label="Tributação">
            {items.map((taxation, index) => (
              <li
                key={taxation.id}
                className={cn(
                  "border p-4 text-sm",
                  index % 2 === 1 && "bg-muted/20"
                )}
              >
                <dl className="grid gap-3 sm:grid-cols-2">
                  <ProductField
                    label="PIS entrada"
                    value={taxation.cst_pis_entrada}
                    mono
                  />
                  <ProductField
                    label="PIS saída"
                    value={taxation.cst_pis_saida}
                    mono
                  />
                  <ProductField
                    label="COFINS entrada"
                    value={taxation.cst_cofins_entrada}
                    mono
                  />
                  <ProductField
                    label="COFINS saída"
                    value={taxation.cst_cofins_saida}
                    mono
                  />
                </dl>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export function ProductApplicationsSection({
  items,
  canConsult,
}: {
  items: ProductApplication[]
  canConsult: boolean
}) {
  if (!canConsult) return null

  return (
    <Card className="sm:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle className="text-lg">Aplicações</CardTitle>
        <CardDescription>
          {items.length === 1
            ? "1 aplicação cadastrada"
            : `${items.length} aplicações cadastradas`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <ProductSectionEmpty
            icon={Layers}
            title="Sem aplicações registradas"
            description="Não há aplicações vinculadas a este produto."
          />
        ) : (
          <ul className="space-y-2" aria-label="Aplicações do produto">
            {items.map((application, index) => (
              <li
                key={application.id}
                className={cn(
                  "border bg-card px-4 py-3 text-sm shadow-sm",
                  index % 2 === 1 && "bg-muted/20"
                )}
              >
                {application.description}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
