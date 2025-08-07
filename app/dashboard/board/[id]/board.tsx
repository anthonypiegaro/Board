import { Plus, SquareCheck, Text } from "lucide-react"

import { Button } from "@/components/ui/button"

export type ChecklistItem = {
  id: string
  name: string
  completed: boolean
  orderNumber: number
}

export type CardChecklist = {
  checklistId: string
  name: string
  type: "checklist"
  checklistItems: ChecklistItem[]
}

export type CardEntity = { entityId: string, orderNumber: number } & CardChecklist

export type Card = {
  id: string
  name: string
  description: string
  orderNumber: number
  cardEntities: CardEntity[]
}

export type List = {
  id: string
  name: string
  orderNumber: number
  cards: Card[]
}

export type Board = {
  id: string
  name: string
  lists: List[]
}

export function BoardPage({
  board
}: {
  board: Board
}) {
  return (
    <div className="w-full h-full p-4 overflow-auto">
      <Header name={board.name} />
      <div className="flex flex-nowrap gap-x-4">
        {board.lists.map(list => (
          <List list={list} />
        ))}
      </div>
      <AddListButton />
    </div>
  )
}

function Header({
  name
}: {
  name: string
}) {
  return (
    <h1 className="text-3xl font-semibold mb-4">
      {name}
    </h1>
  )
}

function List({
  list
}: {
  list: List
}) {
  return (
    <div className="flex flex-col gap-y-4 p-2 rounded-md bg-card">
      <div>
        <h3 className="text-lg font-semibold">
          {list.name}
        </h3>
      </div>
      <div className="flex flex-col gap-y-2">
        {list.cards.map(card => (
          <Card card={card} />
        ))}
      </div>
      <Button variant="ghost" className="flex items-center">
        <Plus className="h-4 w-4" />
        Add card
      </Button>
    </div>
  )
}

function Card({
  card
}: {
  card: Card
}) {
  return (
    <div className="rounded-md">
      <p>
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
              <div className="flex items-center">
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

function AddListButton() {
  return (
    <div className="w-55 p-2 rounded-md bg-neutral-300 dark:bg-neutral-600 dark:border dark:border-neutral-500 shrink-0">
      <Button variant="ghost" className="flex items-center w-full justify-start rounded-md hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-400/80 transition-all gap-x-1 px-2 py-1 cursor-pointer">
        <Plus className="w-4 h-4" />
        <h3 className="font-medium">
          Add a card
        </h3>
      </Button>
    </div>
  )
}