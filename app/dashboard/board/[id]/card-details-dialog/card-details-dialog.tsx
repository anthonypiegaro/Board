"use client"

import { useState } from "react"

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { CardDescription } from "./card-description"
import { updateCardDescription } from "./update-card-description.action"
import { Card } from "../types"
import { EllipsisVertical } from "lucide-react"

export function CardDetailsDialog({
  open,
  onOpenChange,
  onChange,
  card,
  onOpenDeleteCardDialog
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (card: Card) => void
  card: Card
  onOpenDeleteCardDialog: () => void
}) {
  const [isFocused, setIsFocused] = useState(false)

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }

  const handleDescriptionChange = (description: string) => {
    if (description !== card.description) {
      // persist to db
      updateCardDescription({
        cardId: card.id,
        description
      })

      const updatedCard = {
        ...card,
        description: description
      }

      onChange(updatedCard)
    }
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={e => e.preventDefault()}
        onPointerDownOutside={e => {
          if (isFocused) {
            console.log("Prevent close")
            e.preventDefault()
          } else {
            console.log("Wont prevent close")
          }
          console.log(document.activeElement?.tagName)
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <p className="truncate">
              {card.name}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1 hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-400/80 rounded-md transition-all"
                >
                  <EllipsisVertical className="w-5 h-5"/>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  onClick={onOpenDeleteCardDialog}
                  variant="destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DialogTitle>
        </DialogHeader>
        <CardDescription
          description={card.description}
          onChange={handleDescriptionChange}
          onFocus={() => {
            setIsFocused(true)
            console.log("Description focused");
          }}
          onBlur={() => {
            setIsFocused(false)
            console.log("Description blurred");
          }}
        />
      </DialogContent>
    </Dialog>
  )
}