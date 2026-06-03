import { clearAuthCookies, getAccessToken, getRefreshToken, setAuthCookies } from "@/lib/auth/cookies"
import { getApiTimeoutMs, getServerApiBaseUrl } from "@/lib/auth/env"
import { HttpError } from "@/lib/api/http-error"
import { successEnvelopeSchema } from "@/lib/api/envelope"
import { refreshResponseSchema } from "@/modules/authentication/auth.schema"

import { SESSION_FATAL_CODES } from "@/lib/auth/session-fatal-codes"

const ACCESS_INVALID_CODES = new Set([
  "INVALID_ACCESS_TOKEN",
  "MISSING_ACCESS_TOKEN",
])

export async function refreshTokensOnServer(refreshToken: string) {
  const res = await fetch(`${getServerApiBaseUrl()}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    signal: AbortSignal.timeout(getApiTimeoutMs()),
  })

  if (!res.ok) {
    throw await HttpError.fromResponse(res)
  }

  const tokens = successEnvelopeSchema(refreshResponseSchema).parse(await res.json())
    .data
  await setAuthCookies(tokens)
  return tokens
}

type ServerFetchInit = RequestInit & {
  auth?: boolean
  _retry?: boolean
}

/**
 * Pedido à Gescom API no servidor, com Bearer dos cookies e rotação de refresh em 401.
 */
export async function apiServerFetch(
  path: string,
  init: ServerFetchInit = {}
): Promise<Response> {
  const { auth = true, _retry, ...rest } = init
  const url = `${getServerApiBaseUrl()}/${path.replace(/^\/+/, "")}`

  const headers = new Headers(rest.headers)
  if (auth) {
    const accessToken = await getAccessToken()
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`)
    }
  }

  const res = await fetch(url, {
    ...rest,
    headers,
    signal: rest.signal ?? AbortSignal.timeout(getApiTimeoutMs()),
  })

  if (res.status !== 401 || !auth || _retry) {
    return res
  }

  let code = "UNKNOWN"
  try {
    const body = (await res.clone().json()) as { code?: string }
    code = typeof body.code === "string" ? body.code : code
  } catch {
    /* empty */
  }

  if (SESSION_FATAL_CODES.has(code)) {
    await clearAuthCookies()
    return res
  }

  if (!ACCESS_INVALID_CODES.has(code)) {
    return res
  }

  const refreshToken = await getRefreshToken()
  if (!refreshToken) {
    await clearAuthCookies()
    return res
  }

  try {
    await refreshTokensOnServer(refreshToken)
  } catch (err) {
    await clearAuthCookies()
    if (err instanceof HttpError) {
      return new Response(JSON.stringify({
        requestId: err.requestId,
        code: err.code,
        message: err.message,
        details: err.details.length > 0 ? err.details : undefined,
      }), {
        status: err.status,
        headers: { "Content-Type": "application/json" },
      })
    }
    throw err
  }

  return apiServerFetch(path, { ...init, _retry: true })
}
