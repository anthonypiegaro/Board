"use client"

import { useState } from "react"
import { Plus, SquareCheck, Text } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Board, Card, List } from "./types"
import { CreateListDialog, CreateListSchema } from "./create-list-dialog"
import { CreateCardDialog, CreateCardSchema } from "./create-card-dialog"

export function BoardPage({
  initBoard
}: {
  initBoard: Board
}) {
  const [board, setBoard] = useState<Board>(initBoard)
  const [createListDialogOpen, setCreateListDialogOpen] = useState(false)
  const [createCardDialogOpen, setCreateCardDialogOpen] = useState(false)
  const [createCardDialogListId, setCreateCardDialogListId] = useState("")
  const [createCardDialogOrderNumber, setCreateCardDialogOrderNumber] = useState(-1)

  const handleCreateListSuccess = (list: CreateListSchema) => {
    const newList: List = {
      id: list.id,
      name: list.name,
      orderNumber: list.orderNumber,
      cards: []
    }

    setBoard(prev => {
      return ({
        ...prev,
        lists: [...prev.lists, newList]
      })
    })
    setCreateListDialogOpen(false)
  }

  const handleCreateCardSuccess = (card: CreateCardSchema) => {
    const newCard: Card = {
      id: card.id,
      name: card.name,
      description: card.description,
      orderNumber: card.orderNumber,
      cardEntities: []
    }

    setBoard(prev => {
      return ({
        ...prev,
        lists: prev.lists.map(list => {
          if (list.id === card.listId) {
            return {
              ...list,
              cards: [...list.cards, newCard]
            }
          }

          return list
        })
      })
    })

    setCreateCardDialogOpen(false)
  }

  const handleCreateCardDialogOpen = ({ listId, orderNumber }: { listId: string, orderNumber: number }) => {
    setCreateCardDialogListId(listId)
    setCreateCardDialogOrderNumber(orderNumber)
    setCreateCardDialogOpen(true)
  }

  const handleCreateCardDialogClose = () => {
    setCreateCardDialogOpen(false)
    setCreateCardDialogListId("")
    setCreateCardDialogOrderNumber(-1)
  }

  return (
    <>
      <CreateListDialog 
        open={createListDialogOpen}
        onOpenChange={setCreateListDialogOpen}
        boardId={board.id}
        orderNumber={board.lists.length}
        onSuccess={handleCreateListSuccess}
      />
      <CreateCardDialog 
        open={createCardDialogOpen}
        onSuccess={handleCreateCardSuccess}
        onClose={handleCreateCardDialogClose}
        listId={createCardDialogListId}
        orderNumber={createCardDialogOrderNumber}
      />
      <div className="w-full h-full p-4 overflow-auto">
        <Header name={board.name} />
        <div className="flex flex-nowrap items-start gap-x-4">
          {board.lists.map(list => (
            <BoardList key={list.id} list={list} onOpenCreateCardDialog={handleCreateCardDialogOpen} />
          ))}
          <AddListButton onClick={() => setCreateListDialogOpen(true)} />
        </div>
      </div>
    </>
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

function BoardList({
  list,
  onOpenCreateCardDialog
}: {
  list: List
  onOpenCreateCardDialog: ({ listId, orderNumber }: { listId: string, orderNumber: number }) => void
}) {
  return (
    <div className="w-75 p-2 rounded-md bg-neutral-300 dark:bg-neutral-600 dark:border dark:border-neutral-500 shrink-0">
      <div>
        <h3 className="p-2 text-lg font-semibold">
          {list.name}
        </h3>
      </div>
      <div className="flex flex-col gap-y-2">
        {list.cards.map(card => (
          <BoardCard key={card.id} card={card} />
        ))}
        <Button 
          variant="ghost" 
          className="flex items-center w-full justify-start rounded-md hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-400/80 transition-all gap-x-1 px-2 py-1 cursor-pointer"
          onClick={() => onOpenCreateCardDialog({ listId: list.id, orderNumber: list.cards.length })}
        >
          <Plus className="w-4 h-4" />
          <h3 className="font-medium">
            Add a card
          </h3>
        </Button>
      </div>
    </div>
  )
}

function BoardCard({
  card
}: {
  card: Card
}) {
  return (
    <div className="flex flex-col rounded-md border-3 border-transparent bg-neutral-200 dark:bg-neutral-700 dark:ring dark:ring-neutral-500 dark:border-2 hover:border-3 hover:border-neutral-50 dark:hover:border-neutral-500 transition-all text-muted-foreground p-2 cursor-pointer">
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

function AddListButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="w-75 p-2 rounded-md bg-neutral-300 dark:bg-neutral-600 dark:border dark:border-neutral-500 shrink-0">
      <Button 
        variant="ghost" 
        className="flex items-center w-full justify-start rounded-md hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-400/80 transition-all gap-x-1 px-2 py-1 cursor-pointer"
        onClick={onClick}
      >
        <Plus className="w-4 h-4" />
        <h3 className="font-medium">
          Add a list
        </h3>
      </Button>
    </div>
  )
}