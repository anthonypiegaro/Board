import { SquareKanban } from "lucide-react"
import { LuGithub } from "react-icons/lu"

import { ThemeButton } from "./theme-button"

export function Header() {
  return (
    <nav className="flex justify-between bg-indigo-50/50 bg-gradient-backdrop-blur-md w-[calc(100%---spacing(4))] sm:w-[calc(80%+--spacing(8))] mx-auto mt-2 rounded-lg px-4 py-2">
      <div className="flex items-center gap-x-1 font-bold">
        <SquareKanban className="w-6 h-6 font-semibold" />
        <h3 className="text-lg font-semibold">Boards</h3>
      </div>
      <div className="flex items-center gap-x-2">
        <a 
          className="text-foreground/80 dark:text-foreground transition-all duration-300 rounded-md hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/50 p-1"
          href="https://github.com/anthonypiegaro"
          target="_blank"
        >
          <LuGithub size={24} />
        </a>
        <ThemeButton />
      </div>
    </nav>
  )
}