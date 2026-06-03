import { HttpError } from "@/lib/api/http-error"
import {
  firstAccessVerifyClientResponseSchema,
  type FirstAccessVerifyClientResponse,
} from "@/lib/auth/session-response"
import {
  authAckClientResponseSchema,
  type AuthAckClientResponse,
} from "@/modules/authentication/auth-ack.schema"
import {
  firstAccessLookupRequestSchema,
  firstAccessVerifyRequestSchema,
  type FirstAccessLookupRequest,
  type FirstAccessVerifyRequest,
} from "@/modules/authentication/first-access.schema"

async function postFirstAccess<T>(
  path: string,
  body: FirstAccessLookupRequest | FirstAccessVerifyRequest,
  responseSchema: { parse: (data: unknown) => T }
): Promise<T> {
  const res = await fetch(`/api/auth/first-access/${path}`, {
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

export async function firstAccessLookupService(
  input: FirstAccessLookupRequest
): Promise<AuthAckClientResponse> {
  const body = firstAccessLookupRequestSchema.parse(input)
  return postFirstAccess("lookup", body, authAckClientResponseSchema)
}

export async function firstAccessResendService(
  input: FirstAccessLookupRequest
): Promise<AuthAckClientResponse> {
  const body = firstAccessLookupRequestSchema.parse(input)
  return postFirstAccess("resend", body, authAckClientResponseSchema)
}

export async function firstAccessVerifyService(
  input: FirstAccessVerifyRequest
): Promise<FirstAccessVerifyClientResponse> {
  const body = firstAccessVerifyRequestSchema.parse(input)
  return postFirstAccess("verify", body, firstAccessVerifyClientResponseSchema)
}
