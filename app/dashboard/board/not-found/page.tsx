import Link from "next/link"
import { Kanban } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <Kanban className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p className="text-lg mb-2">Board no longer exists</p>
      <p className="text-sm mb-2">Go back to the dashboard</p>
      <Button asChild>
        <Link href="/dashboard">
          Dashboard
        </Link>
      </Button>
    </div>
  )
}