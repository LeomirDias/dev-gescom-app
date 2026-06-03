import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { setAuthCookies } from "@/lib/auth/cookies"
import { getApiTimeoutMs, getServerApiBaseUrl } from "@/lib/auth/env"
import { jsonError } from "@/lib/auth/route-utils"
import { loginClientResponseSchema } from "@/lib/auth/session-response"
import { HttpError } from "@/lib/api/http-error"
import { successEnvelopeSchema } from "@/lib/api/envelope"
import {
  invitationAcceptRequestSchema,
  invitationAcceptResponseSchema,
  invitationMemberIdParamsSchema,
} from "@/modules/authentication/invitation.schema"

type RouteContext = { params: Promise<{ memberId: string }> }

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { memberId } = await context.params
    const id = invitationMemberIdParamsSchema.parse(memberId)
    const body = invitationAcceptRequestSchema.parse(await req.json())

    const res = await fetch(`${getServerApiBaseUrl()}/auth/invitations/${id}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(getApiTimeoutMs()),
    })

    if (!res.ok) {
      throw await HttpError.fromResponse(res)
    }

    const apiPayload = successEnvelopeSchema(invitationAcceptResponseSchema).parse(
      await res.json()
    ).data
    await setAuthCookies(
      {
        accessToken: apiPayload.accessToken,
        refreshToken: apiPayload.refreshToken,
      },
      apiPayload.enterprises
    )

    const clientPayload = loginClientResponseSchema.parse({
      user: apiPayload.user,
      enterprises: apiPayload.enterprises,
    })

    return NextResponse.json(clientPayload)
  } catch (error) {
    return jsonError(error)
  }
}
