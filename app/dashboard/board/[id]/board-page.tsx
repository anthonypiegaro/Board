"use client"

import { ChangeEvent, useEffect, useMemo, useState } from "react"
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
import { cn } from "@/lib/utils"

import { Board, Card, List } from "./types"
import { CreateListDialog, CreateListSchema } from "./create-list-dialog"
import { CreateCardDialog, CreateCardSchema } from "./create-card-dialog"
import { DeleteCardDialog } from "./delete-card-dialog"
import { CardDetailsDialog } from "./card-details-dialog/card-details-dialog"
import { updateListOrder } from "./update-list-order.action"
import { updateCardListIdAndOrder, UpdateCardListIdAndOrderValues } from "./update-card-list-id-and-order.action"
import { updateBoardName } from "./update-board-name.action"
import { updateListName } from "./update-list-name.action"

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
  const [ogActiveListId, setOgActiveListId] = useState<string | null>(null)
  const [boardNameEditing, setBoardNameEditing] = useState(false)
  const [cardDetailsDialogCard, setCardDetailsDialogCard] = useState<Card | null>(null)
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null)

  const activeCard = useMemo(
    () => board.lists.find(list => list.id === ogActiveListId)?.cards.find(card => card.id === activeId),
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

  const handleBoardNameEditSuccess = (name: string) => {
    setBoard(prev => ({
      ...prev,
      name: name
    }))
  }

  const handleCardDetailsDialogOpenChange = (open: boolean) => {
    if (!open) {
      setCardDetailsDialogCard(null)
    }
  }

  const handleCardDetailsDialogMutationSuccess = (card: Card) => {
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(list => ({
        ...list,
        cards: list.cards.map(prevCard => {
          if (prevCard.id === card.id) {
            return card
          }

          return prevCard
        })
      }))
    }))
  }

  const handleListMutation = (list: List) => {
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(prevList => {
        if (prevList.id === list.id) {
          return list
        }

        return prevList
      })
    }))
  }

  const handleCardDeletion = (cardId: string) => {
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(list => ({
        ...list,
        cards: list.cards.filter(card => card.id !== cardId)
      }))
    }))
    setCardToDelete(null)
    setCardDetailsDialogCard(null)
  }

  const handleDeleteCardDialogOpenChange = (open: boolean) => {
    if (!open) {
      setCardToDelete(null)
    } else {
      setCardToDelete(cardDetailsDialogCard)
    }
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
      setOgActiveListId(active.data.current.listId)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over?.id || activeType === "list") {
      return
    }

    const activeContainer = active.data.current?.listId
    const overContainer = over.data.current?.type === "list" ? over.id : over.data.current?.listId

    if (!activeContainer || !overContainer) {
      return
    }

    if (activeContainer !== overContainer) {
      const activeItems = board.lists.find(list => list.id === activeContainer)?.cards
      const overItems = board.lists.find(list => list.id === overContainer)?.cards

      if (!activeItems || !overItems) {
        return
      }

      const activeIndex = activeItems.findIndex(card => card.id === active.id)
      const overIndex = overItems.findIndex(card => card.id === over.id)

      let newIndex: number

      if (over.data.current?.type === "list") {
        newIndex = overItems.length + 1
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top >
            over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
      }

      const newBoard: Board = {
        ...board,
        lists: board.lists.map(list => {
          if (list.id === activeContainer) {
            return {
              ...list,
              cards: list.cards.filter(card => card.id !== active.id).map((card, index) => ({
                ...card,
                orderNumber: index
              }))
            }
          }

          if (list.id === overContainer) {
            return {
              ...list,
              cards: [
                ...overItems.slice(0, newIndex),
                activeItems[activeIndex],
                ...overItems.slice(
                  newIndex,
                  overItems.length
                )
              ].map((card, index) => ({
                ...card,
                orderNumber: index
              }))
            }
          }

          return list
        })
      }

      setBoard(newBoard)
    } else {
      const oldIndex = board.lists.find(list => list.id === active.data.current?.listId)?.cards.findIndex(card => card.id === active.id) ?? -1
      const newIndex = board.lists.find(list => list.id === over.data.current?.listId)?.cards.findIndex(card => card.id === over.id) ?? -1

      if (oldIndex < 0 || newIndex < 0) {
        return
      }

      setBoard(prev => ({
        ...prev,
        lists: prev.lists.map(list => {
          if (list.id === active.data.current?.listId) {
            return {
              ...list,
              cards: arrayMove(list.cards, oldIndex, newIndex).map((card, index) => ({
                ...card,
                orderNumber: index
              }))
            }
          }

          return list
        })
      }))
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.data.current?.type === "list") {
      if (active.id && over?.id) {
        const oldIndex = board.lists.findIndex(list => list.id === active.id)
        const newIndex = board.lists.findIndex(list => list.id === over.id)

        const newLists = arrayMove(board.lists, oldIndex, newIndex).map((list, index) => ({
          ...list,
          orderNumber: index
        }))

        setBoard(prev => ({
          ...prev,
          lists: newLists
        }))

        // persist new list order numbers to the db
        const updateListOrderData = {
          boardId: board.id,
          lists: newLists.map(list => ({
            listId: list.id,
            orderNumber: list.orderNumber
          }))
        }
        updateListOrder(updateListOrderData)
      }
    }

    if (active.data.current?.type === "card") {
      const listId = active.data.current?.listId
      const cardId = active.id

      if (!listId || !cardId) {
        return
      }

      const values: UpdateCardListIdAndOrderValues = {
        cardId: cardId as string,
        listId,
        cards: []
      }

      if (ogActiveListId !== active.data.current?.listId) {
        const oldList = board.lists.find(list => list.id === ogActiveListId)
        const newList = board.lists.find(list => list.id === listId)

        if (!oldList || !newList) {
          return
        }

        oldList.cards.forEach((card, index) => {
          values.cards.push({
            cardId: card.id,
            orderNumber: index
          })
        })

        newList.cards.forEach((card, index) => {
          values.cards.push({
            cardId: card.id,
            orderNumber: index
          })
        })
      } else {
        const list = board.lists.find(list => list.id === ogActiveListId)

        if (!list) {
          return
        }

        list.cards.forEach((card, index) => {
          values.cards.push({
            cardId: card.id,
            orderNumber: index
          })
        })
      }

      updateCardListIdAndOrder(values)
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
      <CardDetailsDialog 
        open={cardDetailsDialogCard !== null}
        onOpenChange={handleCardDetailsDialogOpenChange}
        onChange={handleCardDetailsDialogMutationSuccess}
        card={cardDetailsDialogCard ?? {
          id: "",
          name: "",
          description: "",
          orderNumber: 0,
          cardEntities: []
        }}
        onOpenDeleteCardDialog={() => handleDeleteCardDialogOpenChange(true)}
      />
      <DeleteCardDialog 
        open={cardToDelete !== null}
        onOpenChange={handleDeleteCardDialogOpenChange}
        onSuccess={handleCardDeletion}
        card={cardToDelete ?? {
          id: "",
          name: "",
          description: "",
          orderNumber: 0,
          cardEntities: []
        }}
      />
      <div className="w-full h-full p-4 overflow-auto">
        <Header 
          name={board.name} 
          boardId={board.id}
          isEditing={boardNameEditing} 
          onIsEditingChange={setBoardNameEditing} 
          onSuccess={handleBoardNameEditSuccess} 
        />
        <div className="flex flex-nowrap items-start gap-x-4">
          <SortableContext
            items={board.lists.map(list => list.id)}
          >
            {board.lists.map(list => (
              <BoardList 
                key={list.id} 
                list={list} 
                onOpenCreateCardDialog={handleCreateCardDialogOpen}
                openCardDetails={setCardDetailsDialogCard}
                onListMutation={handleListMutation}
              />
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
  name,
  boardId,
  isEditing,
  onIsEditingChange,
  onSuccess
}: {
  name: string
  boardId: string
  isEditing: boolean
  onIsEditingChange: (isEditing: boolean) => void
  onSuccess: (name: string) => void
}) {
  const [nameInput, setNameInput] = useState("")
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setNameInput(name)
  }, [name])

  const handleBlur = () => {
    handleSubmit()
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value.length === 0) {
      setIsError(true)
      setNameInput(value)
    } else {
      if (value.length < 151) {
        setNameInput(value)
      }
      setIsError(false)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (nameInput.length > 0 && nameInput.length < 151) {
      updateBoardName({
        boardId,
        name: nameInput
      })
      onSuccess(nameInput)
      onIsEditingChange(false)
    }
  }

  if (isEditing) {
    return (
      <input 
        className={cn(
          "text-3xl font-semibold mb-4 focus:outline-none border-b-2 border-transparent focus:border-primary min-w-120",
          isError && "border-destructive"
        )}
        value={nameInput}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    )
  }

  return (
    <h1 
      className="text-3xl font-semibold mb-4"
      onClick={() => onIsEditingChange(true)}
    >
      {name}
    </h1>
  )
}

function BoardList({
  list,
  onOpenCreateCardDialog,
  openCardDetails,
  onListMutation
}: {
  list: List
  onOpenCreateCardDialog: ({ listId, orderNumber }: { listId: string, orderNumber: number }) => void
  openCardDetails: (card: Card) => void
  onListMutation: (list: List) => void
}) {
  const [nameInput, setNameInput] = useState(list.name)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setNameInput(list.name)
  }, [list])

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

  const handleNameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value.length === 0) {
      setIsError(true)
    } else if (value.length > 150) {
      return
    } else {
      setIsError(false)
    }

    setNameInput(value)
  }

  const handleBlur = () => {
    if (!isError && nameInput !== list.name) {
      updateListName({
        listId: list.id,
        listName: nameInput
      })
  
      onListMutation({
        ...list,
        name: nameInput
      })
    }
  }

  return (
    <div
      className={cn(
        "relative w-75 p-2 rounded-md bg-neutral-300 dark:bg-neutral-600 dark:border dark:border-neutral-500 shrink-0",
        active?.id === list.id && "after:absolute after:rounded-md after:inset-0 after:bg-background"
      )}
      {...listeners} {...attributes} ref={setNodeRef} style={style}
    >
      <div className="w-full px-2 py-3 flex justify-between items-center">
        <input 
          className={cn(
            "p-2 text-lg font-semibold border border-transparent rounded-md focus:outline-none focus:bg-neutral-400 focus:dark:bg-neutral-700",
            isError && "border-destructive bg-neutral-400 dark:bg-neutral-700"
          )}
          value={nameInput}
          onChange={handleNameInputChange}
          onBlur={handleBlur}
        />
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
            <BoardCard 
              key={card.id} 
              card={card} 
              listId={list.id}
              openCardDetails={openCardDetails}
            />
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
  listId,
  openCardDetails
}: {
  card: Card
  listId: string
  openCardDetails: (card: Card) => void
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
      onClick={() => openCardDetails(card)}
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