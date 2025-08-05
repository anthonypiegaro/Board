import { ThemeTrigger } from "@/components/theme-trigger"
import { SquareKanban } from "lucide-react"

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-svw h-svh p-2 bg-sidebar">
      <div className="flex bg-background rounded-md flex-col w-full h-full overflow:hidden">
        <div className="w-full p-2 flex gap-x-4 border-b-2 dark:border-neutral-600 items-center">
          <div className="flex items-center gap-x-1 font-semibold text-lg">
            <SquareKanban />
            Board
          </div>
          <div className="h-5 w-[2px] bg-neutral-300 dark:bg-neutral-600 rounded-sm" />
          <div>
            Bread Crumb Here
            {/* 
              Bread crumbs go here. WIll need to find good way to map them,
              The bread crumb may end up beong a client component so I can
              have the name be in sync with the route. FOr exmaple, when I 
              have a board open, the bread crumb will gp from project to 
              board to the board name.

              for example if the url is
              dashboard/project/{project_id}/board/{board id}

              the bread crumb should be somthing like

              dashboard / project / {project-name} / board / {board-name}

              and when on mobile, we may just show if you are on the 
              dashboard or on th eprojects or board page lol
            */}
          </div>
          <ThemeTrigger className="ml-auto hover:bg-fuchsia-200/60 dark:hover:bg-fuchsia-400/60" size="size-6"/>
        </div>
        <div className="grow overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}