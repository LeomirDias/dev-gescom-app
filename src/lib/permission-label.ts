/** Rótulos explícitos quando a heurística não bate com o produto. */
const PERMISSION_LABEL_OVERRIDES: Record<string, string> = {}

const PORTUGUESE_CONNECTORS = new Set(["de", "da", "do", "das", "dos", "e"])

function singularizePortugueseWord(word: string): string {
  const lower = word.toLowerCase()

  if (lower.endsWith("oes")) return `${lower.slice(0, -3)}ao`
  if (lower.endsWith("aes")) return `${lower.slice(0, -3)}ao`
  if (lower.endsWith("ais")) return `${lower.slice(0, -3)}al`
  if (lower.endsWith("res") && lower.length > 5) return lower.slice(0, -2)
  if (lower.endsWith("es") && lower.length > 4) return lower.slice(0, -2)
  if (lower.endsWith("s") && lower.length > 3 && !lower.endsWith("ss")) {
    return lower.slice(0, -1)
  }

  return lower
}

function normalizePermissionWord(word: string): string {
  const lower = word.toLowerCase()
  if (PORTUGUESE_CONNECTORS.has(lower)) return lower
  return singularizePortugueseWord(word)
}

/** Une verbo + complementos; insere "de" em frases compostas (ex.: tipo + produto). */
function joinPermissionPhrase(words: string[]): string {
  if (words.length <= 2) return words.join(" ")

  const [verb, ...rest] = words
  if (rest.some((word) => PORTUGUESE_CONNECTORS.has(word))) {
    return [verb, ...rest].join(" ")
  }

  if (rest.length >= 2) {
    const head = rest[rest.length - 1]!
    const modifiers = rest.slice(0, -1)
    return [verb, ...modifiers, "de", head].join(" ")
  }

  return words.join(" ")
}

/**
 * Converte chaves de permissão (ex.: `alterar_departamentos`) em rótulo legível
 * (ex.: `Alterar departamento`) para exibição na UI.
 */
export function formatPermissionLabel(permission: string): string {
  const trimmed = permission.trim()
  if (!trimmed) return ""

  const overrideKey = trimmed.toLowerCase()
  const override = PERMISSION_LABEL_OVERRIDES[overrideKey]
  if (override) return override

  const words = trimmed.split(/[_\s]+/).filter(Boolean)
  if (words.length === 0) return ""

  const labelWords = words.map((word) => normalizePermissionWord(word))
  const sentence = joinPermissionPhrase(labelWords)
  return sentence.charAt(0).toUpperCase() + sentence.slice(1)
}
