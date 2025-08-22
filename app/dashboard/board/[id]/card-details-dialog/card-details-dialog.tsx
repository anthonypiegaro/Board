"use client"

import { useState } from "react"
import { EllipsisVertical } from "lucide-react"

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
import { CardDetailsHeaderName } from "./card-details-header-name"
import { updateCardName } from "./update-card-name.action"
import { CreateChecklistDialog, CreateChecklistSchema } from "./create-checklist-dialog"

import { Card } from "../types"
import { cardEntity } from "@/db/schema"
import { createChecklist } from "./create-checklist.action"

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
  const [createChecklistDialogOpen, setCreateChecklistDialogOpen] = useState(false)
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

  const handleNameChange = (name: string) => {
    updateCardName({
      id: card.id,
      name
    })

    const updatedCard = {
      ...card,
      name: name
    }

    onChange(updatedCard)
  }

  const handleCreateChecklistDialogOpenChange = (open: boolean) => {
    if (!open) {
      setCreateChecklistDialogOpen(false)
    }
  }

  const handleCreateChecklistSuccess = (checklist: CreateChecklistSchema) => {
    onChange({
      ...card,
      cardEntities: [
        ...card.cardEntities,
        {
          entityId: checklist.entityId,
          orderNumber: 0,
          checklistId: checklist.id,
          name: checklist.name,
          type: "checklist",
          checklistItems: []
        }
      ]
    })
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={handleOpenChange}
    >
      <CreateChecklistDialog 
        cardId={card.id}
        open={createChecklistDialogOpen}
        onOpenChange={handleCreateChecklistDialogOpenChange}
        onSuccess={handleCreateChecklistSuccess}
      />
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
          <DialogTitle className="flex justify-between items-center max-w-full">
            {/* <p className="truncate grow">
              {card.name}
            </p> */}
            <CardDetailsHeaderName 
              cardId={card.id}
              name={card.name}
              onNameChange={handleNameChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1 hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-400/80 rounded-md transition-all shrink-0"
                >
                  <EllipsisVertical className="w-5 h-5"/>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setCreateChecklistDialogOpen(true)
                  }}
                >
                  <p>
                    + Checklist
                  </p>
                </DropdownMenuItem>
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
          }}
          onBlur={() => {
            setIsFocused(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}