"use client"

import { LinkClientPageContent } from "@/app/(app_routes)/clients/_components/link-client-page"
import { CLIENTS_ROUTE_CONFIG } from "@/modules/memberships/membership-route-config"

export default function LinkClientPage() {
  return <LinkClientPageContent config={CLIENTS_ROUTE_CONFIG} />
}
