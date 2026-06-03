import { z } from "zod"
import { loginTypeSchema } from "@/modules/authentication/auth.schema"
import { cpfCnpjSchema } from "@/lib/validation/cpf-cnpj"
import { sixDigitCodeSchema } from "@/lib/validation/code"

const optionalEmailSchema = z
  .string()
  .trim()
  .email()
  .max(255)
  .transform((value) => value.toLowerCase())
  .optional()

export const passwordResetLookupRequestSchema = z
  .strictObject({
    email: optionalEmailSchema,
    cpf: cpfCnpjSchema.optional(),
  })
  .refine((data) => Boolean(data.email?.trim() || data.cpf?.trim()), {
    message: "Informe e-mail ou CPF.",
  })

export type PasswordResetLookupRequest = z.infer<
  typeof passwordResetLookupRequestSchema
>

export const passwordResetVerifyRequestSchema = z.strictObject({
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

export type PasswordResetVerifyRequest = z.infer<
  typeof passwordResetVerifyRequestSchema
>
