/** Rótulos explícitos quando a heurística não bate com o produto. */
const PERMISSION_LABEL_OVERRIDES: Record<string, string> = {}

const PORTUGUESE_CONNECTORS = new Set(["de", "da", "do", "das", "dos", "e"])

/** Termos que não devem passar por singularização (siglas e excepções). */
const IMMUTABLE_WORDS = new Set([
  "anp",
  "cest",
  "cofins",
  "icms",
  "max",
  "min",
  "ncm",
  "nbs",
  "pis",
])

function singularizePortugueseWord(word: string): string {
  const lower = word.toLowerCase()

  if (IMMUTABLE_WORDS.has(lower) || lower.length <= 3) {
    return lower
  }

  if (lower.endsWith("oes")) return `${lower.slice(0, -3)}ao`
  if (lower.endsWith("aes")) return `${lower.slice(0, -3)}ao`
  if (lower.endsWith("ais")) return `${lower.slice(0, -3)}al`
  if (lower.endsWith("eis")) return `${lower.slice(0, -3)}el`
  if (lower.endsWith("ns") && lower.length > 4) return `${lower.slice(0, -2)}m`
  if (lower.endsWith("os") && lower.length > 4) return lower.slice(0, -1)
  if (lower.endsWith("as") && lower.length > 4) return lower.slice(0, -1)

  if (lower.endsWith("es") && lower.length > 4) {
    if (lower.endsWith("ores")) return lower.slice(0, -2)
    const minusS = lower.slice(0, -1)
    if (minusS.endsWith("e") && !minusS.endsWith("re")) return minusS
    return lower.slice(0, -2)
  }

  if (lower.endsWith("res") && lower.length > 5) return lower.slice(0, -2)

  if (lower.endsWith("s") && !lower.endsWith("ss")) {
    return lower.slice(0, -1)
  }

  return lower
}

function normalizePermissionWord(word: string): string {
  const lower = word.toLowerCase()
  if (PORTUGUESE_CONNECTORS.has(lower) || IMMUTABLE_WORDS.has(lower)) {
    return lower
  }
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
