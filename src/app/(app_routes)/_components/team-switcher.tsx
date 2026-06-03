"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Building2, ChevronsUpDown } from "lucide-react"
import { toast } from "sonner"

import { HttpError } from "@/lib/api/http-error"
import { useAuth } from "@/components/providers/authentication/auth-store"
import type { Enterprise } from "@/modules/authentication/auth.schema"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher() {
    const router = useRouter()
    const { enterprises, activeEnterprise, hydrated, switchToEnterprise } =
        useAuth()
    const { isMobile } = useSidebar()
    const [loadingId, setLoadingId] = React.useState<string | null>(null)

    const displayEnterprise = React.useMemo(() => {
        if (activeEnterprise) {
            return activeEnterprise
        }
        const first = enterprises[0]
        if (!first) return null
        return {
            id: first.id,
            tradeName: first.tradeName,
            legalName: first.legalName,
            memberId: first.memberId,
            memberDepartmentId: null as string | null,
        }
    }, [activeEnterprise, enterprises])

    async function onSelect(enterprise: Enterprise) {
        if (enterprise.id === activeEnterprise?.id) {
            return
        }
        setLoadingId(enterprise.id)
        try {
            await switchToEnterprise(enterprise)
            toast.success("Empresa alterada.")
            router.refresh()
        } catch (error) {
            if (error instanceof HttpError) {
                toast.error(error.message)
                return
            }
            toast.error("Nao foi possivel mudar de empresa.")
        } finally {
            setLoadingId(null)
        }
    }

    if (!hydrated || enterprises.length === 0 || !displayEnterprise) {
        return null
    }

    if (enterprises.length === 1) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        size="lg"
                        className="cursor-default"
                        tooltip={displayEnterprise.tradeName}
                    >
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                            <Building2 className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                {displayEnterprise.tradeName}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                                {displayEnterprise.legalName}
                            </span>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            disabled={loadingId !== null}
                            tooltip="Trocar empresa"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <Building2 className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {displayEnterprise.tradeName}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {displayEnterprise.legalName}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Empresas
                        </DropdownMenuLabel>
                        {enterprises.map((enterprise, index) => (
                            <DropdownMenuItem
                                key={enterprise.id}
                                disabled={loadingId !== null}
                                onClick={() => void onSelect(enterprise)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    <Building2 className="size-3.5 shrink-0" />
                                </div>
                                <div className="grid min-w-0 flex-1 text-left">
                                    <span className="truncate font-medium">
                                        {enterprise.tradeName}
                                    </span>
                                    {loadingId === enterprise.id ? (
                                        <span className="text-muted-foreground text-xs">
                                            A processar…
                                        </span>
                                    ) : null}
                                </div>
                                <DropdownMenuShortcut>
                                    #{index + 1}
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
