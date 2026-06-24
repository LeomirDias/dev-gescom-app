import { clsx, type className } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: className[]) {
  return twMerge(clsx(inputs))
}
