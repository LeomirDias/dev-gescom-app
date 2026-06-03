import { HttpError } from "@/lib/api/http-error"

/**
 * POST `/api/auth/logout` — revoga sessão na API e limpa cookies HttpOnly.
 */
export async function logoutService(): Promise<void> {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "same-origin",
  })

  if (!res.ok && res.status !== 204) {
    throw await HttpError.fromResponse(res)
  }
}
