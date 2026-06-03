import { HttpError } from "@/lib/api/http-error"
import {
  authAckClientResponseSchema,
  type AuthAckClientResponse,
} from "@/modules/authentication/auth-ack.schema"
import {
  passwordResetLookupRequestSchema,
  passwordResetVerifyRequestSchema,
  type PasswordResetLookupRequest,
  type PasswordResetVerifyRequest,
} from "@/modules/authentication/password-reset.schema"

async function postPasswordReset<T>(
  path: string,
  body: PasswordResetLookupRequest | PasswordResetVerifyRequest,
  responseSchema: { parse: (data: unknown) => T }
): Promise<T> {
  const res = await fetch(`/api/auth/password-reset/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw await HttpError.fromResponse(res)
  }

  return responseSchema.parse(await res.json())
}

export async function passwordResetRequestService(
  input: PasswordResetLookupRequest
): Promise<AuthAckClientResponse> {
  const body = passwordResetLookupRequestSchema.parse(input)
  return postPasswordReset("request", body, authAckClientResponseSchema)
}

export async function passwordResetResendService(
  input: PasswordResetLookupRequest
): Promise<AuthAckClientResponse> {
  const body = passwordResetLookupRequestSchema.parse(input)
  return postPasswordReset("resend", body, authAckClientResponseSchema)
}

export async function passwordResetVerifyService(
  input: PasswordResetVerifyRequest
): Promise<AuthAckClientResponse> {
  const body = passwordResetVerifyRequestSchema.parse(input)
  return postPasswordReset("verify", body, authAckClientResponseSchema)
}
