import { MembershipDetailContentLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { MEMBERS_ROUTE_CONFIG } from "@/modules/memberships/membership-route-config"

export default function Loading() {
  return (
    <main className="mx-auto w-full p-4 md:p-8">
      <MembershipDetailContentLoading config={MEMBERS_ROUTE_CONFIG} />
    </main>
  )
}
