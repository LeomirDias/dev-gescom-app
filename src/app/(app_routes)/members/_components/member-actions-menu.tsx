"use client"

import Link from "next/link"
import { Eye, LinkIcon, MoreVertical, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type MemberActionsMenuProps = {
  memberId: string
  basePath: string
  canEdit?: boolean
}

export function MemberActionsMenu({
  memberId,
  basePath,
  canEdit = false,
}: MemberActionsMenuProps) {
  const detailHref = `${basePath}/${memberId}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Abrir menu de ações"
          tooltip="Ações"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem asChild>
          <Link
            href={detailHref}
            className="flex cursor-pointer items-center gap-2"
          >
            <Eye className="size-4 shrink-0" aria-hidden />
            Visualizar
          </Link>
        </DropdownMenuItem>

        {canEdit && (
          <DropdownMenuItem asChild>
            <Link
              href={detailHref}
              className="flex cursor-pointer items-center gap-2"
            >
              <Pencil className="size-4 shrink-0" aria-hidden />
              Editar
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-2 text-destructive"
          title="Desvincular membro"
        >
          <LinkIcon className="size-4 shrink-0 " aria-hidden />
          Desvincular
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
