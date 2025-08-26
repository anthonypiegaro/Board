"use client"

import { Square, SquareCheckBig } from "lucide-react"

import { Button } from "@/components/ui/button"

import { ChecklistItem } from "../../types"
import { updateChecklistItemCompleted } from "./update-checklist-item-completed.action"
import { CardChecklistItemOptions } from "./card-checklist-item-options"
import { deleteChecklistItem } from "./delete-checklist-item.action"

export function CardChecklistItemList({
  items,
  onCheckboxClick,
  onDelete
}: {
  items: ChecklistItem[]
  onCheckboxClick: ({ checklistItemId, checklistItemCompleted }: { checklistItemId: string, checklistItemCompleted: boolean }) => void
  onDelete: (checklistItemId: string) => void
}) {
  return (
    <div className="flex flex-col">
      {items.map(item => (
        <CardChecklistItem 
          key={item.id} 
          item={item} 
          onCheckboxClick={onCheckboxClick}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

function CardChecklistItem({
  item,
  onCheckboxClick,
  onDelete
}: {
  item: ChecklistItem
  onCheckboxClick: ({ checklistItemId, checklistItemCompleted }: { checklistItemId: string, checklistItemCompleted: boolean }) => void
  onDelete: (checklistItemId: string) => void
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

  const handleDelete = () => {
    // persist to db
    deleteChecklistItem(item.id)

    onDelete(item.id)
  }

  return (
    <div className="flex items-center py-1 gap-x-2 text-muted-foreground">
      <Button 
        variant="ghost" 
        className="p-1 shrink-0"
        onClick={handleCheckboxClick}
      >
        {
          item.completed
          ? <SquareCheckBig className="h-4 w-4 text-green-700" />
          : <Square className="h-4 w-4" />
        }
      </Button>
      <p className="flex-1">{item.name}</p>
      <CardChecklistItemOptions onDelete={handleDelete}/>
    </div>
  )
}