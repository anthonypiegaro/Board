"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeButton() {
  const { setTheme, theme } = useTheme()

  return (
    <div 
      className="cursor-pointer text-foreground/80 dark:text-foreground relative flex items-center justify-center transition-all duration-300 rounded-md hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/50 p-1" 
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-6 w-6 scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-6 w-6 scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </div>
  )
}
