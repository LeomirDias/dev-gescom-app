"use client"

import type { EnterpriseAddress } from "@/modules/enterprises/enterprises.schema"
import {
  useResolveAddressDisplay,
  type AddressDisplay,
} from "@/modules/addresses/use-resolve-address-display"

export type EnterpriseAddressDisplay = AddressDisplay

export function useResolveEnterpriseAddressDisplay(
  addresses: EnterpriseAddress[],
  enabled = true
) {
  return useResolveAddressDisplay(addresses, enabled)
}
