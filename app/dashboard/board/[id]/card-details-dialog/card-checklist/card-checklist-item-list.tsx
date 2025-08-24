"use client"

import { Square, SquareCheckBig } from "lucide-react"

import { Button } from "@/components/ui/button"

import { ChecklistItem } from "../../types"

export function CardChecklistItemList({
  items
}: {
  items: ChecklistItem[]
}) {
  return (
    <div className="flex flex-col">
      {items.map(item => (
        <CardChecklistItem key={item.id} item={item} />
      ))}
    </div>
  )
}

function CardChecklistItem({
  item
}: {
  item: ChecklistItem
}) {
  return (
    <div className="flex items-center py-1 gap-x-2 text-muted-foreground">
      <Button variant="ghost" className="p-1">
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