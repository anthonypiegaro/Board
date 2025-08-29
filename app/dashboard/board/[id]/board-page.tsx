"use client"

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react"
import { move } from "@dnd-kit/helpers"
import { DragDropProvider } from "@dnd-kit/react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { BoardListTest } from "./board-list/board-list"
import { Board, Card, List } from "./types"
import { CreateListDialog, CreateListSchema } from "./create-list-dialog"
import { CreateCardDialog, CreateCardSchema } from "./create-card-dialog"
import { DeleteCardDialog } from "./delete-card-dialog"
import { DeleteListDialog } from "./delete-list-dialog"
import { CardDetailsDialog } from "./card-details-dialog/card-details-dialog"
import { updateListOrder } from "./update-list-order.action"
import { updateCardListIdAndOrder, UpdateCardListIdAndOrderValues } from "./update-card-list-id-and-order.action"
import { updateBoardName } from "./update-board-name.action"

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
  const [boardNameEditing, setBoardNameEditing] = useState(false)
  const [cardDetailsDialogCardId, setCardDetailsDialogCardId] = useState<string | null>(null)
  const [cardToDelete, setCardToDelete] = useState<Card | null>(null)
  const [deleteListDialogList, setDeleteListDialogList] = useState<{ listId: string, listName: string, numberOfCards: number } | null>(null)

  const cardIdsByListId = useMemo(() => {
    return board.lists.reduce((acc, list) => {
      acc[list.id] = list.cards.map(card => card.id)
      return acc
    }, {} as Record<string, string[]>)
  }, [board])

  const cardDataByCardId = useMemo(() => {
    return board.lists.flatMap(list => list.cards).reduce((acc, card) => {
      acc[card.id] = card
      return acc
    }, {} as Record<string, Card>)
  }, [board])

  const listOrder = useMemo(() => {
    return board.lists.map(list => list.id)
  }, [board])

  const listDataByListId = useMemo(() => {
    return board.lists.reduce((acc, list) => {
      acc[list.id] = list
      return acc
    }, {} as Record<string, List>)
  }, [board])

  const previousCardIdsByListId = useRef(cardIdsByListId)
  const previousCardDataByCardId = useRef(cardDataByCardId)

  const cardDetailsDialogCard = useMemo(() => {
    if (cardDetailsDialogCardId == null) {
      return null
    } else {
      return board.lists.flatMap(list => list.cards).find(card => card.id === cardDetailsDialogCardId) ?? null
    }
  }, [board, cardDetailsDialogCardId])

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
      setCardDetailsDialogCardId(null)
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
    setCardDetailsDialogCardId(null)
  }

  const handleDeleteCardDialogOpenChange = (open: boolean) => {
    if (!open) {
      setCardToDelete(null)
    } else {
      setCardToDelete(cardDetailsDialogCard)
    }
  }

  const handleOpenDeleteListDialog = (list: List) => {
    setDeleteListDialogList({
      listId: list.id,
      listName: list.name,
      numberOfCards: list.cards.length
    })
  }

  const handleDeleteListDialogOpenChange = (open: boolean) => {
    if (!open) {
      setDeleteListDialogList(null)
    }
  }

  const handleDeleteListSuccess = (listId: string) => {
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.filter(list => list.id !== listId)
    }))

    handleDeleteListDialogOpenChange(false)
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
      <DeleteListDialog 
        open={deleteListDialogList !== null}
        onOpenChange={handleDeleteListDialogOpenChange}
        onSuccess={handleDeleteListSuccess}
        listId={deleteListDialogList?.listId ?? ""}
        listName={deleteListDialogList?.listName ?? ""}
        numberOfCards={deleteListDialogList?.numberOfCards ?? 0}
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
          <DragDropProvider
            onDragStart={() => {
              previousCardIdsByListId.current = cardIdsByListId
              previousCardDataByCardId.current = cardDataByCardId
            }}
            onDragOver={event => {
              const { source, target } = event.operation

              if (source?.type === "list") {
                return
              }

              const newCardIdsByListId = move(cardIdsByListId, event)

              setBoard(prev => ({
                ...prev,
                lists: prev.lists.map(list => ({
                  ...list,
                  cards: newCardIdsByListId[list.id].map((cardId, index) => ({
                    ...cardDataByCardId[cardId],
                    orderNumber: index
                  }))
                }))
              }))
            }}
            onDragEnd={event => {
              const { source, target } = event.operation

              if (event.canceled) {
                if (source?.type === "card") {
                  setBoard(prev => ({
                    ...prev,
                    lists: prev.lists.map(list => ({
                      ...list,
                      cards: previousCardIdsByListId.current[list.id].map(cardId => previousCardDataByCardId.current[cardId])
                    }))
                  }))
                }
              }

              if (source?.type === "list") {
                const newListOrder = move(listOrder, event)

                setBoard(prev => ({
                  ...prev,
                  lists: newListOrder.map((listId, index) => ({
                    ...listDataByListId[listId],
                    orderNumber: index
                  }))
                }))

                setTimeout(() => updateListOrder({
                  boardId: board.id,
                  lists: newListOrder.map((listId, index) => ({
                    listId,
                    orderNumber: index
                  }))
                }), 500)
              }

              if (source?.type === "card" && source?.id !== null) {
                // persist card movement to the db
                const oldListId = Object.keys(previousCardIdsByListId.current)
                  .find(listId => previousCardIdsByListId.current[listId].includes(source.id as string))
                const newListId = Object.keys(cardIdsByListId)
                  .find(listId => cardIdsByListId[listId].includes(source.id as string))
                
                if (!oldListId || !newListId) {
                  return
                }

                const updateData: UpdateCardListIdAndOrderValues = {
                  listId: newListId,
                  cardId: source.id as string,
                  cards: cardIdsByListId[newListId].map((cardId, index) => ({
                    cardId,
                    orderNumber: index
                  }))
                }

                if (oldListId !== newListId) {
                  cardIdsByListId[newListId].forEach((cardId, index) => {
                    updateData.cards.push({
                      cardId,
                      orderNumber: index
                    })
                  })
                }

                setTimeout(() => updateCardListIdAndOrder(updateData), 500)
              }
            }}
          >
            {board.lists.map((list, index) => (
              <BoardListTest
                key={list.id} 
                list={list}
                index={index}
                onOpenCreateCardDialog={handleCreateCardDialogOpen}
                openCardDetails={setCardDetailsDialogCardId}
                onListMutation={handleListMutation}
                onOpenDeleteListDialog={() => handleOpenDeleteListDialog(list)}
              />
            ))}
          </DragDropProvider>
          <AddListButton onClick={() => setCreateListDialogOpen(true)} />
        </div>
      </div>
    </>
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