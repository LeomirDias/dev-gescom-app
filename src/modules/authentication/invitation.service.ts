import { HttpError } from "@/lib/api/http-error"
import {
  loginClientResponseSchema,
  type LoginClientResponse,
} from "@/lib/auth/session-response"
import {
  invitationAcceptRequestSchema,
  invitationActionResponseSchema,
  invitationMemberIdParamsSchema,
  type InvitationAcceptRequest,
  type InvitationActionResponse,
} from "@/modules/authentication/invitation.schema"

async function postInvitationAction(
  memberId: string,
  action: "decline" | "resend"
): Promise<InvitationActionResponse | null> {
  const id = invitationMemberIdParamsSchema.parse(memberId)

  const res = await fetch(`/api/auth/invitations/${id}/${action}`, {
    method: "POST",
    credentials: "same-origin",
  })

  if (!res.ok) {
    throw await HttpError.fromResponse(res)
  }

  if (res.status === 204) {
    return null
  }

  return invitationActionResponseSchema.parse(await res.json())
}

export async function invitationAcceptService(
  memberId: string,
  input: InvitationAcceptRequest
): Promise<LoginClientResponse> {
  const id = invitationMemberIdParamsSchema.parse(memberId)
  const body = invitationAcceptRequestSchema.parse(input)

  const res = await fetch(`/api/auth/invitations/${id}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw await HttpError.fromResponse(res)
  }

  return loginClientResponseSchema.parse(await res.json())
}

export async function invitationDeclineService(
  memberId: string
): Promise<InvitationActionResponse | null> {
  return postInvitationAction(memberId, "decline")
}

export async function invitationResendService(
  memberId: string
): Promise<InvitationActionResponse | null> {
  return postInvitationAction(memberId, "resend")
}
