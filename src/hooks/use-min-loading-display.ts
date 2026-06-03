"use client"

import { useEffect, useState } from "react"

/** TODO: remover após visualizar o design (definir 0 para desativar). */
export const LOADING_PREVIEW_MS = 0

/** Mantém o loading visível pelo menos `minMs` após o mount (útil para pré-visualizar o design). */
export function useMinLoadingDisplay(
  isLoading: boolean,
  minMs = LOADING_PREVIEW_MS,
) {
  const [minElapsed, setMinElapsed] = useState(minMs <= 0)

  useEffect(() => {
    if (minMs <= 0) return
    const timer = setTimeout(() => setMinElapsed(true), minMs)
    return () => clearTimeout(timer)
  }, [minMs])

  if (minMs <= 0) return isLoading
  return isLoading || !minElapsed
}
