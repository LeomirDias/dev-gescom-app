"use client"

import type { FormEvent, ReactNode } from "react"

import { PageHeader } from "@/components/global/structural/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import { formInputFocusClassName } from "@/components/global/forms/form-input-classes"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type PageFormField = {
  id: string
  name: string
  placeholder?: string
  type?: string
  autoComplete?: string
  required?: boolean
  className?: string
}

export type PageFormCardProps = {
  title: string
  subtitle: string
  fields: PageFormField[]
  children?: ReactNode
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  submitLabel: string
  pendingLabel?: string
  isPending?: boolean
  variant?: "page" | "sheet"
  cardClassName?: string
  submitClassName?: string
}

export function PageFormCard({
  title,
  subtitle,
  fields,
  children,
  onSubmit,
  submitLabel,
  pendingLabel,
  isPending = false,
  variant = "page",
  cardClassName,
  submitClassName,
}: PageFormCardProps) {
  const isSheet = variant === "sheet"

  const form = (
    <form
      onSubmit={onSubmit}
      className={cn(isSheet && "flex min-h-0 flex-1 flex-col")}
    >
      <FieldGroup
        className={cn(isSheet && "min-h-0 flex-1 gap-0")}
      >
        <div
          className={cn(
            isSheet
              ? "flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4"
              : "grid gap-4 sm:grid-cols-2"
          )}
        >
          {fields.map((field) => (
            <Field
              key={field.id}
              className={cn(isSheet ? "w-full" : field.className)}
            >
              <Input
                id={field.id}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                required={field.required}
                className={formInputFocusClassName}
              />
            </Field>
          ))}
          {children}
        </div>
        <div
          className={cn(
            isSheet
              ? "shrink-0 border-t px-6 py-4"
              : "flex w-full justify-start"
          )}
        >
          <Button
            type="submit"
            disabled={isPending}
            variant="default"
            className={cn(isSheet ? "w-full" : "w-full sm:w-auto", submitClassName)}
          >
            {isPending && pendingLabel ? pendingLabel : submitLabel}
          </Button>
        </div>
      </FieldGroup>
    </form>
  )

  if (isSheet) {
    return (
      <div
        className={cn(
          "flex h-full min-h-0 flex-col bg-transparent",
          cardClassName
        )}
      >
        {form}
      </div>
    )
  }

  return (
    <Card className={cn("bg-background border-none ring-0", cardClassName)}>
      <CardHeader>
        <PageHeader title={title} subtitle={subtitle} />
      </CardHeader>
      <CardContent>{form}</CardContent>
    </Card>
  )
}
