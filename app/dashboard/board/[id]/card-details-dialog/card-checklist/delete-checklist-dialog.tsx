"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { deleteCardChecklist } from "./delete-card-checklist.action"

export function DeleteChecklistDialog({
  entityId,
  checklistName,
  open,
  onOpenChange,
  onSuccess
}: {
  entityId: string
  checklistName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (entityId: string) => void
}) {
  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
  }
  
  const handleDelete = () => {
    // persits to db
    deleteCardChecklist(entityId)
    onSuccess(entityId)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Checklist
          </DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          Are you sure you want to delete the checklist
          <span className="text-destructive"> {checklistName}</span>?
          {" "}This action cannot be undone.
        </p>
        <div className="flex justify-end gap-x-2">
          <Button 
            variant="ghost"
            onClick={() => handleOpenChange(false)}
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