import type { EnterpriseAddress } from "@/modules/enterprises/enterprises.schema"

export const ENTERPRISE_PRINCIPAL_ADDRESS_EXISTS_MESSAGE =
  "Já existe um endereço principal cadastrado para esta empresa. Altere o tipo ou edite o endereço principal existente."

export function findPrincipalEnterpriseAddress(
  addresses: EnterpriseAddress[]
): EnterpriseAddress | undefined {
  return addresses.find((address) => address.adressType === "PRINCIPAL")
}

export function hasConflictingPrincipalEnterpriseAddress(
  addresses: EnterpriseAddress[],
  adressType: string,
  editingAddressId?: string | null
): boolean {
  if (adressType !== "PRINCIPAL") return false

  const existing = findPrincipalEnterpriseAddress(addresses)
  if (!existing) return false
  if (editingAddressId && existing.id === editingAddressId) return false

  return true
}

export function isEnterprisePrincipalAddressError(error: {
  code: string
  adressType?: string
}): boolean {
  if (error.code === "ENTERPRISE_ADDRESS_PRINCIPAL_ALREADY_EXISTS") {
    return true
  }

  return (
    error.code === "INTERNAL_SERVER_ERROR" && error.adressType === "PRINCIPAL"
  )
}
