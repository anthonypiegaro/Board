"use client"

import { useSortable } from "@dnd-kit/react/sortable"
import { SquareCheck, Text } from "lucide-react"

import { Card } from "../types"

export function BoardCardTest({
  card,
  index,
  listId,
  openCardDetails
}: {
  card: Card
  index: number
  listId: string
  openCardDetails: (cardId: string) => void
}) {
  const { ref, isDragging } = useSortable({
    id: card.id,
    index,
    type: "card",
    accept: "card",
    group: listId
  })

  return (
    <div 
      className="touch-none relative flex flex-col rounded-md border-3 border-transparent bg-neutral-200 dark:bg-neutral-700 dark:ring dark:ring-neutral-500 dark:border-2 hover:border-3 hover:border-neutral-50 dark:hover:border-neutral-500 transition-all text-muted-foreground p-2 cursor-pointer"
      onClick={() => openCardDetails(card.id)}
      ref={ref}
      data-dragging={isDragging}
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