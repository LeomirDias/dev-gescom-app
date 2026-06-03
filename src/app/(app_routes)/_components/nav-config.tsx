"use client"

import { usePathname } from "next/navigation"
import {
    type LucideIcon,
} from "lucide-react"

import { isSidebarPathActive } from "@/app/(app_routes)/_components/route-labels"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavConfiguration({
    items,
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const pathname = usePathname()

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Configuração</SidebarGroupLabel>
            <SidebarMenu className="flex flex-col gap-1">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            tooltip={item.title}
                            isActive={isSidebarPathActive(pathname, item.url)}
                        >
                            <a href={item.url}>
                                <item.icon />
                                <span>{item.title}</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
