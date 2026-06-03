import { z } from "zod"
import { authUserSchema, loginTypeSchema } from "@/modules/authentication/auth.schema"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { sixDigitCodeSchema } from "@/lib/validation/code"

const optionalEmailSchema = z
  .string()
  .trim()
  .email()
  .max(255)
  .transform((value) => value.toLowerCase())
  .optional()

export const firstAccessLookupRequestSchema = z
  .strictObject({
    email: optionalEmailSchema,
    cpf: cpfCnpjSchema.optional(),
  })
  .refine((data) => Boolean(data.email?.trim() || data.cpf?.trim()), {
    message: "Informe e-mail ou CPF.",
  })

export type FirstAccessLookupRequest = z.infer<
  typeof firstAccessLookupRequestSchema
>

export const firstAccessVerifyRequestSchema = z.strictObject({
  loginType: loginTypeSchema,
  login: z.string().min(1).max(255),
  code: sixDigitCodeSchema,
  password: z.string().min(8).max(255),
  confirmPassword: z.string().min(8).max(255),
})
  .refine((d) => d.password === d.confirmPassword, {
    message: "Senhas nao conferem.",
    path: ["confirmPassword"],
  })

export type FirstAccessVerifyRequest = z.infer<
  typeof firstAccessVerifyRequestSchema
>

export const firstAccessVerifyResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  user: authUserSchema,
})

export type FirstAccessVerifyResponse = z.infer<
  typeof firstAccessVerifyResponseSchema
>
