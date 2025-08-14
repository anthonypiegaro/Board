"use client"

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import { Card } from "./types"

export function CardDetailsDialog({
  open,
  onOpenChange,
  onSuccess,
  card
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (card: Card) => void
  card: Card
}) {
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {card.name}
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}