import { getApiTimeoutMs } from "@/lib/api/env"
import { HttpError } from "@/lib/api/http-error"

type JsonInit = Omit<RequestInit, "body"> & {
  body?: Record<string, unknown> | undefined
}

/**
 * Cliente HTTP same-origin: pedidos passam pelo BFF `/api/proxy/*`
 * (cookies HttpOnly; refresh no servidor).
 */
export async function apiFetch<T>(path: string, init: JsonInit = {}): Promise<T> {
  const { body, ...rest } = init
  const normalizedPath = path.replace(/^\/+/, "")
  const url = `/api/proxy/${normalizedPath}`

  const headers = new Headers(rest.headers)
  if (body !== undefined) {
    headers.set("Content-Type", "application/json")
  }

  const timeoutMs = getApiTimeoutMs()
  const timeoutSignal = AbortSignal.timeout(timeoutMs)
  const userSignal = rest.signal ?? undefined
  const mergedSignal = userSignal
    ? AbortSignal.any([userSignal, timeoutSignal])
    : timeoutSignal

  const res = await fetch(url, {
    ...rest,
    credentials: "same-origin",
    signal: mergedSignal,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) {
    return null as T
  }

  if (!res.ok) {
    throw await HttpError.fromResponse(res)
  }

  return (await res.json()) as T
}
