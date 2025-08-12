"use client"

import { useMemo, useState } from "react"
import { createPortal } from "react-dom"
import {
  DndContext, 
  DragEndEvent, 
  DragOverEvent, 
  DragOverlay,
  DragStartEvent,
  PointerSensor, 
  UniqueIdentifier, 
  useSensor 
} from "@dnd-kit/core"
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { EllipsisVertical, Plus, SquareCheck, Text } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Board, Card, List } from "./types"
import { CreateListDialog, CreateListSchema } from "./create-list-dialog"
import { CreateCardDialog, CreateCardSchema } from "./create-card-dialog"
import { cn } from "@/lib/utils"

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
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [activeType, setActiveType] = useState<"list" | "card" | null>(null)
  const [activeListId, setActiveListId] = useState<string | null>(null)

  const activeCard = useMemo(
    () => board.lists.find(list => list.id === activeListId)?.cards.find(card => card.id === activeId),
    [activeId]
  )

  const activeList = useMemo(
    () => board.lists.find(list => list.id === activeId),
    [activeId]
  )


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

  const sensor = useSensor(PointerSensor, {
    activationConstraint: { 
      distance: 15
    }
  })

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event

    setActiveId(active.id)
    setActiveType(active.data.current?.type)
    if (active.data.current?.type === "card") {
      setActiveType("card")
      setActiveListId(active.data.current.listId)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.data.current?.type === "list") {
      if (active.id && over?.id) {
        const oldIndex = board.lists.findIndex(list => list.id === active.id)
        const newIndex = board.lists.findIndex(list => list.id === over.id)

        setBoard(prev => ({
          ...prev,
          lists: arrayMove(prev.lists, oldIndex, newIndex)
        }))
      }
    }
  }

  return (
    <DndContext
      sensors={[sensor]}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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
          <SortableContext
            items={board.lists.map(list => list.id)}
          >
            {board.lists.map(list => (
              <BoardList key={list.id} list={list} onOpenCreateCardDialog={handleCreateCardDialogOpen} />
            ))}
          </SortableContext>
          <AddListButton onClick={() => setCreateListDialogOpen(true)} />
        </div>
      </div>
      {
        createPortal(
          <DragOverlay>
            {
              activeId 
                ?  activeType === "list" 
                  ? activeList && ListOverlay({ list: activeList })
                  : activeCard && CardOverlay({ card: activeCard })
                : null 
            }
          </DragOverlay>,
          document.body
        )
      }
    </DndContext>
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
  const {
    active,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: list.id,
    data: {
      type: "list"
    }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  }

  return (
    <div
      className={cn(
        "relative w-75 p-2 rounded-md bg-neutral-300 dark:bg-neutral-600 dark:border dark:border-neutral-500 shrink-0",
        active?.id === list.id && "after:absolute after:rounded-md after:inset-0 after:bg-background"
      )}
      {...listeners} {...attributes} ref={setNodeRef} style={style}
    >
      <div className="w-full px-4 py-3 flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {list.name}
        </h3>
        <div className="p-1 hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-400/80 rounded-md transition-all">
          <EllipsisVertical className="w-4 h-4" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <SortableContext
          items={list.cards.map(card => card.id)}
          strategy={horizontalListSortingStrategy}
        >
          {list.cards.map(card => (
            <BoardCard key={card.id} card={card} listId={list.id} />
          ))}
        </SortableContext>
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
  card,
  listId
}: {
  card: Card
  listId: string
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

function CardOverlay({
  card
}: {
  card: Card
}) {
  return (
    <div 
      className="flex flex-col rounded-md border-3 border-transparent bg-neutral-200 dark:bg-neutral-700 dark:ring dark:ring-neutral-500 dark:border-2 hover:border-3 hover:border-neutral-50 dark:hover:border-neutral-500 transition-all text-muted-foreground p-2 cursor-grabbing rotate-5 after:absolute after:-inset-1 after:bg-neutral-400/30 after:rounded-md"
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

function ListOverlay({
  list
}: {
  list: List
}) {
  return (
    <div
      className="w-75 p-2 rounded-md bg-neutral-300 dark:bg-neutral-600 dark:border dark:border-neutral-500 shrink-0"
    >
      <div className="w-full px-4 py-3 flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {list.name}
        </h3>
        <div className="p-1 hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-400/80 rounded-md transition-all">
          <EllipsisVertical className="w-4 h-4" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        {list.cards.map(card => (
          <ListOverlayCard key={card.id} card={card} />
        ))}
        <Button 
          variant="ghost" 
          className="flex items-center w-full justify-start rounded-md hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-400/80 transition-all gap-x-1 px-2 py-1 cursor-pointer"
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

function ListOverlayCard({
  card
}: {
  card: Card
}) {
  return (
    <div 
      className="relative flex flex-col rounded-md border-3 border-transparent bg-neutral-200 dark:bg-neutral-700 dark:ring dark:ring-neutral-500 dark:border-2 hover:border-3 hover:border-neutral-50 dark:hover:border-neutral-500 transition-all text-muted-foreground p-2 cursor-pointer"
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