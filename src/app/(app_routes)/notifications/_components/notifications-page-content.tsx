"use client"

import { NotificationsEmptyState } from "@/app/(app_routes)/notifications/_components/notifications-empty-state"

export function NotificationsPageContent() {
  // Quando a API de notificações existir:
  // - useNotificationsQuery em modules/notifications/
  // - renderizar lista quando items.length > 0, senão NotificationsEmptyState
  // - useRegisterPageRefresh para refetch

  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Notificações</h1>
        <p className="text-sm text-muted-foreground">
          Acompanhe avisos e atualizações da sua conta
        </p>
      </div>

      <NotificationsEmptyState />
    </main>
  )
}
