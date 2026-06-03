import { NextResponse } from "next/server"
import { HttpError } from "@/lib/api/http-error"

export function jsonError(error: unknown, fallbackStatus = 500) {
  if (error instanceof HttpError) {
    return NextResponse.json(
      {
        requestId: error.requestId,
        code: error.code,
        message: error.message,
        details: error.details.length > 0 ? error.details : undefined,
      },
      { status: error.status }
    )
  }
  const message =
    error instanceof Error ? error.message : "Erro interno do servidor."
  return NextResponse.json(
    {
      requestId: null,
      code: "INTERNAL_SERVER_ERROR",
      message,
    },
    { status: fallbackStatus }
  )
}
