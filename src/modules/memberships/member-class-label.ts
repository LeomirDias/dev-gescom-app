import type { EnterpriseMemberClass } from "@/modules/memberships/memberships.schema"

const CLASS_LABELS: Record<EnterpriseMemberClass, string> = {
  ADMINISTRADOR: "Administrador",
  GERENTE: "Gerente",
  COLABORADOR: "Colaborador",
  CLIENTE: "Cliente",
  FORNECEDOR: "Fornecedor",
  PARCEIRO: "Parceiro",
  SOCIO: "Socio",
  INVESTIDOR: "Investidor",
  AUDITOR: "Auditor",
  OUTRO: "Outro",
}

export function getMemberClassLabel(
  memberClass: EnterpriseMemberClass | string
): string {
  return CLASS_LABELS[memberClass as EnterpriseMemberClass] ?? memberClass
}

export const MEMBER_CLASS_OPTIONS = (
  Object.keys(CLASS_LABELS) as EnterpriseMemberClass[]
).map((value) => ({
  value,
  label: CLASS_LABELS[value],
}))
