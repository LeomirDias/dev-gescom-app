import type { EnterpriseAddressType } from "@/modules/enterprises/enterprise-addresses.schema"

const ADDRESS_TYPE_LABELS: Record<string, string> = {
  RESIDENCIAL: "Residencial",
  COMERCIAL: "Comercial",
  ENTREGA: "Entrega",
  COBRANCA: "Cobrança",
  FATURAMENTO: "Faturamento",
  SECUNDARIO: "Secundário",
  PRINCIPAL: "Principal",
  OUTRO: "Outro",
}

export const ENTERPRISE_ADDRESS_TYPE_OPTIONS: {
  value: EnterpriseAddressType
  label: string
}[] = [
  { value: "PRINCIPAL", label: "Principal" },
  { value: "SECUNDARIO", label: "Secundário" },
  { value: "COMERCIAL", label: "Comercial" },
  { value: "RESIDENCIAL", label: "Residencial" },
  { value: "ENTREGA", label: "Entrega" },
  { value: "COBRANCA", label: "Cobrança" },
  { value: "FATURAMENTO", label: "Faturamento" },
  { value: "OUTRO", label: "Outro" },
]

export function getEnterpriseAddressTypeLabel(type: string): string {
  return ADDRESS_TYPE_LABELS[type] ?? type
}
