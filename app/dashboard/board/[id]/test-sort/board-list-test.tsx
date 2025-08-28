"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react"
import { CollisionPriority } from "@dnd-kit/abstract"
import { useDroppable } from "@dnd-kit/react"
import { EllipsisVertical, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import { BoardCardTest } from "./board-card-test"
import { updateListName } from "../update-list-name.action"
import { List } from "../types"

export function BoardListTest({
  list,
  onOpenCreateCardDialog,
  openCardDetails,
  onListMutation,
  onOpenDeleteListDialog
}: {
  list: List
  onOpenCreateCardDialog: ({ listId, orderNumber }: { listId: string, orderNumber: number }) => void
  openCardDetails: (cardId: string) => void
  onListMutation: (list: List) => void
  onOpenDeleteListDialog: () => void
}) {
  const [nameInput, setNameInput] = useState(list.name)
  const [isError, setIsError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const { ref } = useDroppable({
    id: list.id,
    type: "list",
    accept: "card",
    collisionPriority: CollisionPriority.Low
  })

  useEffect(() => {
    setNameInput(list.name)
  }, [list])

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      inputRef.current?.blur()
    }
  }

  return (
    <div
      className="relative w-75 p-2 rounded-md bg-neutral-300 dark:bg-neutral-600 dark:border dark:border-neutral-500 shrink-0"
      ref={ref}
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
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-400/80 rounded-md transition-all">
              <EllipsisVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
              variant="destructive" 
              onClick={async () => {
                await new Promise(resolve => setTimeout(resolve, 0))
                onOpenDeleteListDialog()
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col gap-y-2">
        {list.cards.map((card, index) => (
          <BoardCardTest
            key={card.id}
            index={index}
            card={card} 
            listId={list.id}
            openCardDetails={openCardDetails}
          />
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