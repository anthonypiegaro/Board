"use client"

import { useRef, useState } from "react"
import { CollisionPriority } from "@dnd-kit/abstract"
import { move } from "@dnd-kit/helpers"
import { DragDropProvider, useDroppable } from "@dnd-kit/react"
import { useSortable } from "@dnd-kit/react/sortable"

import { Card } from "@/components/ui/card"

export function Test() {
  const [cards, setCards] = useState({
    "listA": ["cardA", "cardB", "cardC"],
    "listB": ["cardD"],
    "listC": []
  })
  const previousCards = useRef(cards)
  const [listOrder, setListOrder] = useState(() => Object.keys(cards))

  return (
    <div className="w-dvw h-dvh">
      <h1 className="text-3xl semibold">
        Test Page for Multi-Container Sortable Drag and Drop
      </h1>
      <div className="w-full p-5 mx-auto flex gap-x-4">
        <DragDropProvider
          onDragStart={() => {
            previousCards.current = cards
          }}
          onDragOver={(event => {
            const { source, target } = event.operation

            if (source?.type === "list") {
              return
            }

            setCards(cards => move(cards, event))
          })}
          onDragEnd={event => {
            const { source, target } = event.operation

            if (event.canceled) {
              if (source?.type === "card") {
                setCards(previousCards.current)
              }

              return
            }

            if (source?.type === "list") {
              setListOrder(lists => move(lists, event))
            }
          }}
        >
          {Object.entries(cards).map(([listId, cardIds], index) => <List key={listId} id={listId} cards={cardIds} index={index} />)}
        </DragDropProvider>
      </div>
    </div>
  )
}

function List({
  id,
  cards,
  index
}: {
  id: string
  cards: string[]
  index: number
}) {
  const { ref } = useSortable({
    id,
    index,
    type: "list",
    collisionPriority: CollisionPriority.Low,
    accept: ["card", "list"],
  })

  return (
    <Card className="w-75 gap-y-2" ref={ref}>
      <p className="text-center text-lg font-medium">{id}</p>
      {cards.map((cardId, index) => <SortCard key={cardId} id={cardId} listId={id} index={index} />)}
    </Card>
  )
}

function SortCard({
  id,
  listId,
  index
}: {
  id: string
  listId: string
  index: number
}) {
  const { ref, isDragging } = useSortable({
    id,
    index,
    type: "card",
    accept: "card",
    group: listId
  })

  return (
    <Card className="p-1" ref={ref} data-dragging={isDragging}>
      {id}
    </Card>
  )
}