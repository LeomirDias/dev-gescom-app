
import { AnimatedLoading } from "@/components/global/listing/paginated-list-shell"

export default function Loading() {
  return (
    <main className="mx-auto flex w-full flex-col gap-6 p-4 md:p-8">
      <AnimatedLoading />
    </main>
  )
}
