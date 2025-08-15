"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { deleteList } from "./delete-list.action"

export function DeleteListDialog({
  open,
  onOpenChange,
  onSuccess,
  listId,
  listName,
  numberOfCards
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (listId: string) => void
  listId: string
  listName: string
  numberOfCards: number
}) {
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleDelete = () => {
    deleteList(listId)
    onSuccess(listId)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete List
          </DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          Are you sure you want to delete the list
          <span className="text-destructive"> {listName}</span>?{" "}
          {
            numberOfCards > 0 && (
              <span>
                This will also delete {numberOfCards > 2 && "all"}
                <span className="text-destructive"> {numberOfCards} </span>
                card{numberOfCards > 1 && "s"} currently inside the list.{" "}
              </span>
            )
          }
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-x-2">
          <Button
            variant="ghost"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}