import Link from "next/link"
import { SquareKanban } from "lucide-react"

import { ThemeTrigger } from "@/components/theme-trigger"

import { Breadcrumb } from "./breadrcumb"
import { ProfileButton } from "./profile-button"

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-svw h-svh p-2 bg-sidebar">
      <div className="flex bg-background rounded-md flex-col w-full h-full overflow:hidden">
        <div className="w-full md:px-4 p-2 flex gap-x-4 border-b-2 dark:border-neutral-600 items-center">
          <Link 
            className="flex items-center gap-x-1 font-semibold text-lg"
            href="/dashboard"
          >
            <SquareKanban />
            Board
          </Link>
          <div className="h-5 w-[2px] bg-neutral-300 dark:bg-neutral-600 rounded-sm" />
          <Breadcrumb />
          <div className="flex gap-x-1 ml-auto">
            <ThemeTrigger className="hover:bg-fuchsia-200/60 dark:hover:bg-fuchsia-400/60" size="size-6"/>
            <ProfileButton />
          </div>
        </div>
        <div className="grow overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}