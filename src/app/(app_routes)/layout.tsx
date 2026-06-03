import React from "react"
import { AppSidebar } from "@/app/(app_routes)/_components/app-sidebar"
import { NavHeader } from "@/app/(app_routes)/_components/nav-header"
import { AuthGate } from "@/app/(app_routes)/_components/auth-gate"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGate>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="bg-background">
            <div className="flex min-h-svh flex-1 flex-col">
              <NavHeader />
              <div className="min-h-0 flex-1 overflow-auto">{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AuthGate>
  )
}
