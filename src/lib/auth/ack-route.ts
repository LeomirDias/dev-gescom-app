import { z } from "zod"
import { successEnvelopeSchema } from "@/lib/api/envelope"

export function parseApiAckEnvelope(json: unknown): { message: string } {
  const envelope = successEnvelopeSchema(z.null()).parse(json)
  return { message: envelope.message }
}
