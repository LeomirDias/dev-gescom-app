import type { NextRequest } from "next/server"
import { jsonError } from "@/lib/auth/route-utils"
import { handleInvitationActionResponse } from "@/lib/auth/invitation-route-utils"
import { apiServerFetch } from "@/lib/auth/server-fetch"
import { invitationMemberIdParamsSchema } from "@/modules/authentication/invitation.schema"

type RouteContext = { params: Promise<{ memberId: string }> }

export async function POST(_req: NextRequest, context: RouteContext) {
  try {
    const { memberId } = await context.params
    const id = invitationMemberIdParamsSchema.parse(memberId)

    const res = await apiServerFetch(`auth/invitations/${id}/decline`, {
      method: "POST",
    })

    return handleInvitationActionResponse(res)
  } catch (error) {
    return jsonError(error)
  }
}
