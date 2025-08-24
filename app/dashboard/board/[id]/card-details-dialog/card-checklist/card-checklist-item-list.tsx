"use client"

import { Square, SquareCheckBig } from "lucide-react"

import { Button } from "@/components/ui/button"

import { ChecklistItem } from "../../types"
import { updateChecklistItemCompleted } from "./update-checklist-item-completed.action"

export function CardChecklistItemList({
  items,
  onCheckboxClick
}: {
  items: ChecklistItem[]
  onCheckboxClick: ({ checklistItemId, checklistItemCompleted }: { checklistItemId: string, checklistItemCompleted: boolean }) => void
}) {
  return (
    <div className="flex flex-col">
      {items.map(item => (
        <CardChecklistItem 
          key={item.id} 
          item={item} 
          onCheckboxClick={onCheckboxClick}
        />
      ))}
    </div>
  )
}

function CardChecklistItem({
  item,
  onCheckboxClick
}: {
  item: ChecklistItem
  onCheckboxClick: ({ checklistItemId, checklistItemCompleted }: { checklistItemId: string, checklistItemCompleted: boolean }) => void
}) {
  const handleCheckboxClick = () => {
    // persist to db
    updateChecklistItemCompleted({
      checklistItemId: item.id,
      checklistItemCompleted: !item.completed
    })

    onCheckboxClick({
      checklistItemId: item.id,
      checklistItemCompleted: !item.completed
    })
  }

  return (
    <div className="flex items-center py-1 gap-x-2 text-muted-foreground">
      <Button 
        variant="ghost" 
        className="p-1"
        onClick={handleCheckboxClick}
      >
        {
          item.completed
          ? <SquareCheckBig className="h-4 w-4 text-green-700" />
          : <Square className="h-4 w-4" />
        }
      </Button>
      <p>{item.name}</p>
    </div>
  )
}