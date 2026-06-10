"use client"

import { InviteMemberPageContent } from "@/app/(app_routes)/members/_components/invite-member-page"
import { MEMBERS_ROUTE_CONFIG } from "@/modules/memberships/membership-route-config"

export default function InviteMemberPage() {
  return <InviteMemberPageContent config={MEMBERS_ROUTE_CONFIG} />
}
