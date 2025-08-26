"use client"

import { Square, SquareCheckBig } from "lucide-react"

import { Button } from "@/components/ui/button"

import { ChecklistItem } from "../../types"
import { updateChecklistItemCompleted } from "./update-checklist-item-completed.action"
import { CardChecklistItemOptions } from "./card-checklist-item-options"
import { deleteChecklistItem } from "./delete-checklist-item.action"
import { CardChecklistItemName } from "./card-checklist-item-name"

export function CardChecklistItemList({
  items,
  onCheckboxClick,
  onItemNameChange,
  onDelete,
  onFocus,
  onBlur
}: {
  items: ChecklistItem[]
  onCheckboxClick: ({ checklistItemId, checklistItemCompleted }: { checklistItemId: string, checklistItemCompleted: boolean }) => void
  onDelete: (checklistItemId: string) => void
  onItemNameChange: ({ id, name }: { id: string, name: string }) => void
  onFocus: () => void
  onBlur: () => void
}) {
  return (
    <div className="flex flex-col w-full max-w-full">
      {items.map(item => (
        <CardChecklistItem 
          key={item.id} 
          item={item} 
          onCheckboxClick={onCheckboxClick}
          onNameChange={onItemNameChange}
          onDelete={onDelete}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      ))}
    </div>
  )
}

function CardChecklistItem({
  item,
  onCheckboxClick,
  onNameChange,
  onDelete,
  onFocus,
  onBlur
}: {
  item: ChecklistItem
  onCheckboxClick: ({ checklistItemId, checklistItemCompleted }: { checklistItemId: string, checklistItemCompleted: boolean }) => void
  onNameChange: ({ id, name }: { id: string, name: string }) => void
  onDelete: (checklistItemId: string) => void
  onFocus: () => void
  onBlur: () => void
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

  const handleNameChange = (name: string) => {
    onNameChange({
      id: item.id,
      name: name
    })
  }

  return (
    <div className="w-full max-w-full flex items-center gap-x-1 text-muted-foreground">
      <Button 
        variant="ghost" 
        className="p-0 shrink-0"
        onClick={handleCheckboxClick}
      >
        {
          item.completed
          ? <SquareCheckBig className="h-4 w-4 text-green-700" />
          : <Square className="h-4 w-4" />
        }
      </Button>
      <CardChecklistItemName 
        name={item.name}
        onSuccess={handleNameChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      <CardChecklistItemOptions onDelete={handleDelete}/>
    </div>
  )
}