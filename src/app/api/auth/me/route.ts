import { NextResponse } from "next/server"
import { jsonError } from "@/lib/auth/route-utils"
import { apiServerFetch } from "@/lib/auth/server-fetch"
import { HttpError } from "@/lib/api/http-error"
import { successEnvelopeSchema } from "@/lib/api/envelope"
import { meResponseSchema } from "@/modules/authentication/auth.schema"

export async function GET() {
  try {
    const res = await apiServerFetch("auth/me", { method: "GET" })

    if (!res.ok) {
      throw await HttpError.fromResponse(res)
    }

    const payload = successEnvelopeSchema(meResponseSchema).parse(await res.json())
      .data
    return NextResponse.json(payload)
  } catch (error) {
    return jsonError(error)
  }
}
