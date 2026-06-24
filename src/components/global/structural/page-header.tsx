"use client"

import type { ReactNode } from "react"

import { RouteBreadcrumb } from "../navigation/route-breadcrumb"

type PageHeaderProps = {
  title: string
  subtitle: string
  note?: string
  actions?: ReactNode
}

export function PageHeader({
  title,
  subtitle,
  note,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <RouteBreadcrumb />
      <div
        className={
          actions
            ? "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
            : undefined
        }
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          {note && (
            <p className="mt-2 text-sm text-muted-foreground">{note}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        )}
      </div>
    </div>
  )
}
