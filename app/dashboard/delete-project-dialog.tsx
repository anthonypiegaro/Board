"use client"

import { ChangeEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { deleteProject } from "./delete-project.action"

export function DeleteProjectDialog({
  open,
  onOpenChange,
  onDelete,
  projectId,
  projectName
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (projectId: string) => void
  projectId: string
  projectName: string
}) {
  const [nameInput, setNameInput] = useState("")

  const handleOpenChange = (open: boolean) => {
    setNameInput("")
    onOpenChange(open)
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    setNameInput(value)
  }

  const handleDelete = () => {
    deleteProject(projectId)
    onDelete(projectId)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete Project
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-y-4">
          <p className="text-muted-foreground">
            Type the name of the project
            <span className="text-destructive"> {projectName} </span>
            to delete. All Boards inside the project will also be deleted.
            This action cannot be undone.
          </p>
          <Input 
            className="mx-auto"
            value={nameInput}
            onChange={handleInputChange}
          />
          <div className="flex justify-end items-center gap-x-2">
            <Button variant="ghost" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={nameInput !== projectName}
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}