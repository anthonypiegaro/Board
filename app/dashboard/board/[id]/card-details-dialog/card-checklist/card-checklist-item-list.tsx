"use client"

import { useMemo } from "react"
import { move } from "@dnd-kit/helpers"
import { DragDropProvider } from "@dnd-kit/react"
import { useSortable } from "@dnd-kit/react/sortable"
import { Grip, Square, SquareCheckBig } from "lucide-react"

import { Button } from "@/components/ui/button"

import { ChecklistItem } from "../../types"
import { updateChecklistItemCompleted } from "./update-checklist-item-completed.action"
import { CardChecklistItemOptions } from "./card-checklist-item-options"
import { deleteChecklistItem } from "./delete-checklist-item.action"
import { CardChecklistItemName } from "./card-checklist-item-name"
import { UpdateChecklistItemOrderSchema } from "./update-checklist-item-order.action"

export function CardChecklistItemList({
  items,
  checklistId,
  onCheckboxClick,
  onItemNameChange,
  onChecklistItemOrderChange,
  onDelete,
  onFocus,
  onBlur
}: {
  items: ChecklistItem[]
  checklistId: string
  onCheckboxClick: ({ checklistItemId, checklistItemCompleted }: { checklistItemId: string, checklistItemCompleted: boolean }) => void
  onDelete: (checklistItemId: string) => void
  onItemNameChange: ({ id, name }: { id: string, name: string }) => void
  onChecklistItemOrderChange: (values: UpdateChecklistItemOrderSchema) => void
  onFocus: () => void
  onBlur: () => void
}) {
  const itemOrder = useMemo(() => items.map(item => item.id), [items])

  return (
    <div className="flex flex-col w-full max-w-full">
      <DragDropProvider
        onDragEnd={event => {
          const newItemsOrder = move(itemOrder, event)

          setTimeout(() => onChecklistItemOrderChange({
            checklistId,
            items: newItemsOrder.map((itemId, index) => ({
              itemId,
              orderNumber: index
            }))
          }), 500)
        }}
      >
        {items.map((item, index) => (
          <CardChecklistItem 
            key={item.id} 
            item={item}
            index={index} 
            onCheckboxClick={onCheckboxClick}
            onNameChange={onItemNameChange}
            onDelete={onDelete}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        ))}
      </DragDropProvider>
    </div>
  )
}

function CardChecklistItem({
  item,
  index,
  onCheckboxClick,
  onNameChange,
  onDelete,
  onFocus,
  onBlur
}: {
  item: ChecklistItem
  index: number
  onCheckboxClick: ({ checklistItemId, checklistItemCompleted }: { checklistItemId: string, checklistItemCompleted: boolean }) => void
  onNameChange: ({ id, name }: { id: string, name: string }) => void
  onDelete: (checklistItemId: string) => void
  onFocus: () => void
  onBlur: () => void
}) {
  const { ref, handleRef, isDragging } = useSortable({
    id: item.id,
    index,
    type: "item",
    accept: "item"
  })

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
    <div 
      className="w-full max-w-full flex items-center gap-x-1 text-muted-foreground data-[dragging=true]:dark:bg-card/20 data-[dragging=true]:bg-card/80" 
      ref={ref}
      data-dragging={isDragging}
    >
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
      <Button className="shrink-0" variant="ghost" size="icon" ref={handleRef}>
        <Grip className="w-4 h-4"/>
      </Button>
    </div>
  )
}