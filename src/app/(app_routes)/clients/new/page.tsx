"use client"

import { useRequireEnterprise } from "@/hooks/use-require-enterprise"
import { CreateClientPage } from "@/app/(app_routes)/clients/new/_components/create-client-page"

export default function NewClientPage() {
  const { enterpriseId } = useRequireEnterprise()

  if (!enterpriseId) return null

  return <CreateClientPage enterpriseId={enterpriseId} />
}
