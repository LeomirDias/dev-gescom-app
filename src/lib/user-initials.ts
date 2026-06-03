/** Iniciais para avatar: primeiro e último nome, ou duas letras do nome único. */
export function getUserInitials(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return "?"

  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    const first = parts[0]?.[0] ?? ""
    const last = parts[parts.length - 1]?.[0] ?? ""
    return `${first}${last}`.toUpperCase()
  }

  const word = parts[0] ?? ""
  if (word.length >= 2) return word.slice(0, 2).toUpperCase()
  return word[0]?.toUpperCase() ?? "?"
}
