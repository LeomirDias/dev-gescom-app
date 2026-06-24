"use client"

import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { LinkClientPage } from "@/app/(app_routes)/clients/link/_components/link-client-page"

export default function LinkClientRoutePage() {
  const { enterpriseId } = useRequireEnterprise()

  if (!enterpriseId) return null

  return <LinkClientPage enterpriseId={enterpriseId} />
}
