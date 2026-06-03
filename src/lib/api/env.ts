/**
 * URL base legada (cliente). Preferir BFF `/api/proxy/*`; mantido para compatibilidade.
 * No servidor use `getServerApiBaseUrl()` em `@/lib/auth/env`.
 */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (!raw) {
    throw new Error(
      "NEXT_PUBLIC_API_URL não definido. Copie .env.example para .env.local."
    )
  }
  return raw.replace(/\/+$/, "")
}

export function getApiTimeoutMs(): number {
  const raw = process.env.API_TIMEOUT_MS
  const n = raw ? Number.parseInt(raw, 10) : 10_000
  return Number.isFinite(n) && n > 0 ? n : 10_000
}
