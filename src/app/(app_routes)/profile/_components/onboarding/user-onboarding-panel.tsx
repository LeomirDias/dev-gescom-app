"use client"

import { Loader2 } from "lucide-react"

import { UserAddressesSection } from "@/app/(app_routes)/profile/_components/onboarding/user-addresses-section"
import { UserContactsSection } from "@/app/(app_routes)/profile/_components/onboarding/user-contacts-section"
import { UserFinancialInfoSection } from "@/app/(app_routes)/profile/_components/onboarding/user-financial-info-section"
import { UserPersonalInfoSection } from "@/app/(app_routes)/profile/_components/onboarding/user-personal-info-section"
import { UserRelationshipsSection } from "@/app/(app_routes)/profile/_components/onboarding/user-relationships-section"
import { UserTaxInfosSection } from "@/app/(app_routes)/profile/_components/onboarding/user-tax-infos-section"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { UserDetailsResponse } from "@/modules/users-onboarding/users-onboarding.schema"

export function UserOnboardingPanel({
  details,
  enterpriseId,
  userId,
  memberId,
  canAlter,
  isLoading,
  title = "Onboarding do utilizador",
  description = "Informações pessoais, endereços, contatos e dados fiscais/financeiros.",
}: {
  details: UserDetailsResponse | undefined
  enterpriseId: string
  userId: string
  memberId?: string
  canAlter: boolean
  isLoading?: boolean
  title?: string
  description?: string
}) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Carregando dados complementares...</CardDescription>
        </CardHeader>
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  if (!details) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <UserPersonalInfoSection
        enterpriseId={enterpriseId}
        userId={userId}
        memberId={memberId}
        personalInfo={details.personalInfo}
        canAlter={canAlter}
      />

      <UserAddressesSection
        enterpriseId={enterpriseId}
        userId={userId}
        memberId={memberId}
        addresses={details.addresses}
        canAlter={canAlter}
      />

      <UserContactsSection
        enterpriseId={enterpriseId}
        userId={userId}
        memberId={memberId}
        contacts={details.contacts}
        canAlter={canAlter}
      />

      <UserRelationshipsSection
        enterpriseId={enterpriseId}
        userId={userId}
        memberId={memberId}
        relationships={details.relationships}
        canAlter={canAlter}
      />

      <UserTaxInfosSection
        enterpriseId={enterpriseId}
        userId={userId}
        memberId={memberId}
        taxInfos={details.taxInfos}
        canAlter={canAlter}
      />

      <UserFinancialInfoSection
        enterpriseId={enterpriseId}
        userId={userId}
        memberId={memberId}
        financialInfo={details.financialInfo}
        canAlter={canAlter}
      />
    </div>
  )
}
