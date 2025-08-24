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
import { CardChecklist } from "./card-checklist/card-checklist"
import { ChecklistNameChangeSchema } from "./card-checklist/card-checklist-header"
import { updateCardChecklistName } from "./card-checklist/update-card-checklist-name.action"
import { DeleteChecklistDialog } from "./card-checklist/delete-checklist-dialog"
import { AddChecklistItemDialog, CreateChecklistItemSchema } from "./card-checklist/add-checklist-item-dialog"

export type AddChecklistItemDialogEntity = {
  checklistId: string
  checklistItemOrderNumber: number
}

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
  const [deleteChecklistDialogEntity, setDeleteChecklistDialogEntity] = useState<{ entityId: string, checklistName: string } | null>(null)
  const [addChecklistItemDialogEntity, setAddChecklistItemDialogEntity] = useState<AddChecklistItemDialogEntity | null>(null)
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

  const handleChecklistNameChange = (values: ChecklistNameChangeSchema) => {
    // persist to db
    updateCardChecklistName(values)

    onChange({
      ...card,
      cardEntities: card.cardEntities.map(entity => {
        if (entity.entityId === values.entityId) {
          return {
            ...entity,
            name: values.checklistName
          }
        } else {
          return entity
        }
      })
    })
  }

  const handleDeleteChecklistDialogOpenChange = (open: boolean) => {
    if (!open) {
      setDeleteChecklistDialogEntity(null)
    }
  }

  const handleDeleteChecklistSuccess = (entityId: string) => {
    onChange({
      ...card,
      cardEntities: card.cardEntities.filter(entity => entity.entityId !== entityId)
    })
    handleDeleteChecklistDialogOpenChange(false)
  }

  const handleAddChecklistItemDialogOpenChange = (open: boolean) => {
    if (!open) {
      setAddChecklistItemDialogEntity(null)
    }
  }

  const handleAddChecklistItemSuccess = (item: CreateChecklistItemSchema) => {
    onChange({
      ...card,
      cardEntities: card.cardEntities.map(card => {
        if (card.checklistId === item.checklistId) {
          return {
            ...card,
            checklistItems: [...card.checklistItems, {
              id: item.checklistItemId,
              name: item.checklistItemName,
              completed: false,
              orderNumber: item.checklistItemOrderNumber
            }]
          }
        } else {
          return card
        }
      })
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
      <DeleteChecklistDialog 
        open={deleteChecklistDialogEntity !== null}
        onOpenChange={handleDeleteChecklistDialogOpenChange}
        entityId={deleteChecklistDialogEntity?.entityId ?? ""}
        checklistName={deleteChecklistDialogEntity?.checklistName ?? ""}
        onSuccess={handleDeleteChecklistSuccess}
      />
      <AddChecklistItemDialog 
        checklistId={addChecklistItemDialogEntity?.checklistId ?? ""}
        checklistItemOrderNumber={addChecklistItemDialogEntity?.checklistItemOrderNumber ?? 0}
        open={addChecklistItemDialogEntity !== null}
        onOpenChange={handleAddChecklistItemDialogOpenChange}
        onSuccess={handleAddChecklistItemSuccess}
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
            <CardDetailsHeaderName 
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
        {card.cardEntities.map(entity => {
          if (entity.type === "checklist") {
            return (
              <CardChecklist
                key={entity.entityId}
                checklist={entity}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChecklistNameChange={handleChecklistNameChange}
                onOpenDeleteChecklistDialog={() => setDeleteChecklistDialogEntity({
                  entityId: entity.entityId,
                  checklistName: entity.name
                })}
                onOpenAddChecklistItemDialog={() => setAddChecklistItemDialogEntity({
                  checklistId: entity.checklistId,
                  checklistItemOrderNumber: entity.checklistItems.length
                })}
              />
            )
          }
        })}
      </DialogContent>
    </Dialog>
  )
}