import { MembershipFormContentLoading } from "@/app/(app_routes)/members/_components/members-route-loading"
import { Skeleton } from "@/components/ui/skeleton"
import { MEMBERS_ROUTE_CONFIG } from "@/modules/memberships/membership-route-config"

export default function Loading() {
  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <Skeleton className="h-4 w-48" />
      <MembershipFormContentLoading config={MEMBERS_ROUTE_CONFIG} />
    </main>
  )
}
