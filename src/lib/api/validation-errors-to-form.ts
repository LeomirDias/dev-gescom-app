import type { ApiErrorDetail } from "@/lib/api/http-error"

/** Mapeia `details[].path` da API para nomes de campo do formulário. */
export function mapValidationDetailsToFields(
  details: ApiErrorDetail[],
  pathAliases: Record<string, string> = {}
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const detail of details) {
    const segments = detail.path.split(".").filter(Boolean)
    const raw = segments[segments.length - 1] ?? detail.path
    const field = pathAliases[raw] ?? raw
    if (!errors[field]) {
      errors[field] = detail.message
    }
  }

  return errors
}
