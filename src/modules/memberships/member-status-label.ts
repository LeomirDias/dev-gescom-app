import type { MemberStatus } from "@/modules/memberships/memberships.schema"

const STATUS_LABELS: Record<MemberStatus, string> = {
  ATIVO: "Ativo",
  INATIVO: "Inativo",
  BLOQUEADO: "Bloqueado",
  PENDENTE: "Pendente",
  ESPECIAL: "Especial",
  COBRANCA: "Cobrança",
  NAO_VENDER: "Não vender",
}

export function getMemberStatusLabel(status: MemberStatus | string): string {
  return STATUS_LABELS[status as MemberStatus] ?? status
}

export const MEMBER_STATUS_OPTIONS = (
  Object.keys(STATUS_LABELS) as MemberStatus[]
).map((value) => ({
  value,
  label: STATUS_LABELS[value],
}))
