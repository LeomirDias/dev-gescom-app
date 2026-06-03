import { NextResponse } from "next/server"
import { HttpError } from "@/lib/api/http-error"
import { successEnvelopeSchema } from "@/lib/api/envelope"
import { z } from "zod"
import { invitationActionResponseSchema } from "@/modules/authentication/invitation.schema"

export async function handleInvitationActionResponse(res: Response) {
  if (!res.ok) {
    throw await HttpError.fromResponse(res)
  }

  if (res.status === 204) return new NextResponse(null, { status: 204 })

  const text = await res.text()
  if (!text) return new NextResponse(null, { status: 204 })

  // A API devolve envelope de sucesso com `data: null` para ações (decline/resend).
  // Mantemos 204 no BFF para compatibilidade com o client.
  try {
    const json: unknown = JSON.parse(text)
    successEnvelopeSchema(z.null()).parse(json)
    return new NextResponse(null, { status: 204 })
  } catch {
    const json: unknown = JSON.parse(text)
    const payload = invitationActionResponseSchema.parse(json)
    return NextResponse.json(payload)
  }
}
