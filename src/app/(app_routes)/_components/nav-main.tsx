"use client"

import { usePathname } from "next/navigation"
import { ChevronRight, type LucideIcon } from "lucide-react"

import { isSidebarPathActive } from "@/app/(app_routes)/_components/route-labels"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    //idebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        items?: {
            title: string
            url: string
        }[]
    }[]
}) {
    const pathname = usePathname()

    return (
        <SidebarGroup>
            {/* <SidebarGroupLabel>
                <h2 className="text-sm font-medium">Navegação</h2>
            </SidebarGroupLabel> */}
            <SidebarMenu>
                {items.map((item) => {
                    const hasSubItems = (item.items?.length ?? 0) > 0

                    if (!hasSubItems) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={isSidebarPathActive(pathname, item.url)}
                                    className="py-2"
                                >
                                    <a href={item.url}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    }

                    const isGroupActive = item.items!.some((subItem) =>
                        isSidebarPathActive(pathname, subItem.url)
                    )

                    return (
                        <Collapsible
                            key={`${item.title}-${pathname}`}
                            asChild
                            defaultOpen={isGroupActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={isGroupActive}
                                        className="py-2"
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items!.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={isSidebarPathActive(
                                                        pathname,
                                                        subItem.url
                                                    )}
                                                >
                                                    <a href={subItem.url}>
                                                        <span>{subItem.title}</span>
                                                    </a>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
