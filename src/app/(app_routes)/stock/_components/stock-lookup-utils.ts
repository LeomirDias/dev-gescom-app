export function formatIdFallback(id: string): string {
  return `${id.slice(0, 8)}…`
}

export function buildLookupMap<T>(
  items: T[] | undefined,
  getId: (item: T) => string,
  getLabel: (item: T) => string
): Map<string, string> {
  return new Map(items?.map((item) => [getId(item), getLabel(item)]) ?? [])
}

export function buildObjectMap<T>(
  items: T[] | undefined,
  getId: (item: T) => string
): Map<string, T> {
  return new Map(items?.map((item) => [getId(item), item]) ?? [])
}

export function formatQuantity(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—"
  const num = typeof value === "number" ? value : parseFloat(String(value))
  if (isNaN(num)) return String(value)
  return num.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
