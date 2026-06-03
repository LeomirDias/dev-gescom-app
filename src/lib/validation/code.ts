import { z } from "zod"

export const sixDigitCodeSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, ""))
  .pipe(
    z.string().regex(/^\d{6}$/, "Código deve conter exatamente 6 dígitos.")
  )

