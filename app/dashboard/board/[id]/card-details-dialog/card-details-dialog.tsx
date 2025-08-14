"use client"

import { useRef, useState } from "react"

import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle
} from "@/components/ui/dialog"

import { CardDescription } from "./card-description"
import { updateCardDescription } from "./update-card-description.action"
import { Card } from "../types"

export function CardDetailsDialog({
  open,
  onOpenChange,
  onChange,
  card
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (card: Card) => void
  card: Card
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
          <DialogTitle className="text-2xl">
            {card.name}
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