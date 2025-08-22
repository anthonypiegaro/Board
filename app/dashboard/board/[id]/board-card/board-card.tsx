"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { SquareCheck, Text } from "lucide-react"

import { cn } from "@/lib/utils"

import { Card } from "../types"

export function BoardCard({
  card,
  listId,
  openCardDetails
}: {
  card: Card
  listId: string
  openCardDetails: (cardId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    active
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      listId
    }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <div 
      className={cn(
        "relative flex flex-col rounded-md border-3 border-transparent bg-neutral-200 dark:bg-neutral-700 dark:ring dark:ring-neutral-500 dark:border-2 hover:border-3 hover:border-neutral-50 dark:hover:border-neutral-500 transition-all text-muted-foreground p-2 cursor-pointer",
        active?.id === card.id && "relative after:absolute after:-inset-1 after:bg-neutral-400 dark:after:bg-neutral-700 after:rounded-md"
      )}
      onClick={() => openCardDetails(card.id)}
      {...attributes} {...listeners} style={style} ref={setNodeRef}
    >
      <p className="text-sm font-semibold">
        {card.name}
      </p>
      <div className="flex gap-x-1">
        {card.description.length > 0 && <Text className="w-4 h-4" />}
        {card.cardEntities.map(entity => {
          if (entity.type === "checklist") {
            const completedTasks = entity.checklistItems.reduce((acc, item) => {
              if (item.completed) {
                acc += 1
              }

              return acc
            }, 0)

            const totalTasks = entity.checklistItems.length

            return (
              <div key={entity.entityId} className="flex items-center">
                <SquareCheck className="w-4 h-4" />
                <span className="text-xs">{completedTasks}/{totalTasks}</span>
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}