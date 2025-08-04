"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeTrigger({
  className,
  size
}: {
  className?: string
  size?: string
}) {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn("cursor-pointer text-foreground/80 dark:text-foreground relative flex items-center justify-center transition-all duration-300 rounded-md hover:bg-accent/50 hover:text-accent-foreground dark:hover:bg-accent/50 p-1", className)} 
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className={cn("scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90", size)} />
      <Moon className={cn("absolute scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0", size)} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
