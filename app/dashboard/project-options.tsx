"use client"

import { EllipsisVertical } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function ProjectOptions({
  onOpenDeleteProjectDialog
}: {  
  onOpenDeleteProjectDialog: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="px-1 py-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 transition-all rounded-md"
        >
          <EllipsisVertical className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem 
          variant="destructive"
          onClick={async () => {
            await new Promise(resolve => setTimeout(resolve, 0))
            onOpenDeleteProjectDialog()
          }}
        >
          Delete Project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}