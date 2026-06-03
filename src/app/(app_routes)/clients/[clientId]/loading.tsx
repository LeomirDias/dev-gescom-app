import { ClientDetailContentLoading } from "@/app/(app_routes)/clients/_components/clients-route-loading"

export default function Loading() {
  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <ClientDetailContentLoading />
    </main>
  )
}
