"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { deleteCard } from "./delete-card.action"
import { Card } from "./types"

export function DeleteCardDialog({
  open,
  onOpenChange,
  onSuccess,
  card
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (cardId: string) => void
  card: Card
}) {
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }

  const handleDelete = () => {
    deleteCard(card.id)
    onSuccess(card.id)
  }

  const handleClose = () => {
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Card
          </DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          Are you sure you want to delete card
          <span className="text-destructive"> {card.name}</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-x-2 justify-end">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}