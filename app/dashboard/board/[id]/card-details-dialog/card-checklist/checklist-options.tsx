"use client"

import { EllipsisVertical } from "lucide-react"

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function ChecklistOptions({
  onOpenDeleteChecklistDialog
}: {
  onOpenDeleteChecklistDialog: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-1 hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-400/80 rounded-md transition-all shrink-0"
        >
          <EllipsisVertical className="w-5 h-5"/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          variant="destructive"
          onClick={onOpenDeleteChecklistDialog}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}