/** Monta campos de PATCH/POST para formulários de onboarding. */

export type OnboardingPatchBody = Record<string, unknown>

/** Texto: em PATCH envia `null` quando o campo foi limpo. */
export function appendOnboardingStringField(
  body: OnboardingPatchBody,
  key: string,
  formValue: string,
  original: string | null | undefined,
  isPatch: boolean
): void {
  const next = formValue.trim()
  const prev = (original ?? "").trim()

  if (!isPatch) {
    if (next) body[key] = next
    return
  }

  if (next === prev) return
  body[key] = next || null
}

/** Enum/select de string: em PATCH envia `null` quando desmarcado. */
export function appendOnboardingEnumField<T extends string>(
  body: OnboardingPatchBody,
  key: string,
  formValue: T | "",
  original: T | null | undefined,
  isPatch: boolean
): void {
  if (!isPatch) {
    if (formValue) body[key] = formValue
    return
  }

  const prev = original ?? null
  const next = formValue || null

  if (next === prev) return
  body[key] = next
}

/** Número a partir de input text: em PATCH envia `null` quando o campo foi limpo. */
export function appendOnboardingNumberField(
  body: OnboardingPatchBody,
  key: string,
  formValue: string,
  original: number | null | undefined,
  isPatch: boolean
): void {
  const trimmed = formValue.trim()

  if (!isPatch) {
    if (trimmed) body[key] = Number(trimmed)
    return
  }

  const prev = original ?? null
  const next = trimmed === "" ? null : Number(trimmed)

  if (next === prev) return
  if (trimmed === "" && prev === null) return
  body[key] = next
}

/** Select Sim/Não/vazio: em PATCH envia `null` quando voltou ao placeholder. */
export function appendOnboardingBoolSelectField(
  body: OnboardingPatchBody,
  key: string,
  formValue: string,
  original: boolean | null | undefined,
  isPatch: boolean
): void {
  const next =
    formValue === "true" ? true : formValue === "false" ? false : null

  if (!isPatch) {
    if (next !== null) body[key] = next
    return
  }

  const prev = original ?? null
  if (next === prev) return
  body[key] = next
}
