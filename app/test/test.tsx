"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/react/sortable"

import { Card } from "@/components/ui/card"

export function Test() {
  const [cards, setCards] = useState({
    "listA": ["cardA", "cardB", "cardC"],
    "listB": ["cardD"],
    "listC": []
  })

  return (
    <div className="w-dvw h-dvh">
      <h1 className="text-3xl semibold">
        Test Page for Multi-Container Sortable Drag and Drop
      </h1>
      <div className="w-full p-5 mx-auto flex gap-x-4">
        {Object.entries(cards).map(([listId, cardIds]) => <List key={listId} id={listId} cards={cardIds} />)}
      </div>
    </div>
  )
}

function List({
  id,
  cards
}: {
  id: string
  cards: string[]
}) {
  return (
    <Card className="w-75 gap-y-2">
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