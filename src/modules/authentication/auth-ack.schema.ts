import { z } from "zod"

/** Resposta do BFF para operações com `data: null` na API (lookup, resend, verify ack). */
export const authAckClientResponseSchema = z.object({
  message: z.string(),
})

export type AuthAckClientResponse = z.infer<typeof authAckClientResponseSchema>
