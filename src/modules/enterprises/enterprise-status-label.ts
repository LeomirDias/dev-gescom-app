import type { EnterpriseStatus } from "@/modules/enterprises/enterprises.schema"

const STATUS_LABELS: Record<EnterpriseStatus, string> = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
  BLOQUEADO: "Bloqueado",
  PENDENTE: "Pendente",
  ESPECIAL: "Especial",
  COBRANCA: "Cobrança",
  NAO_VENDER: "Não vender",
}

export function getEnterpriseStatusLabel(status: string): string {
  return STATUS_LABELS[status as EnterpriseStatus] ?? status
}
