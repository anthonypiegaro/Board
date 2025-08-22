"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

export type ChecklistNameChangeSchema = {
  entityId: string
  checklistId: string
  checklistName: string
}

export function CardChecklistHeader({
  entityId,
  checklistId,
  checklistName,
  onSuccess,
  onBlur,
  onFocus
}: {
  entityId: string
  checklistId: string
  checklistName: string
  onSuccess: (checklist: ChecklistNameChangeSchema) => void
  onBlur: () => void
  onFocus: () => void
}) {
  const [nameInput, setNameInput] = useState(checklistName)
  const [isError, setIsError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setNameInput(checklistName)
  }, [checklistName])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value.length === 0) {
      setNameInput(value)
      setIsError(true)
    } else if (value.length > 150) {
      // do nothing
    } else {
      setNameInput(value)
      setIsError(false)
    }
  }

  const handleBlur = async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
    if (!isError) {
      onSuccess({
        entityId: entityId,
        checklistId: checklistId,
        checklistName: nameInput
      })
    }
    onBlur()
  }

  const handleFocus = async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
    onFocus()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      inputRef.current?.blur()
    }
  }

  return (
    <input 
      className={cn(
        "transition-all flex-1 p-1 font-medium truncate ring ring-[3px] ring-transparent border border-transparent rounded-md focus:outline-none focus:ring-ring/50 focus:dark:ring-transparent focus:border-ring focus:dark:bg-input/30",
        isError && "border-destructive focus:border-destructive focus:ring-destructive/10 dark:bg-input/30"
      )}
      ref={inputRef}
      value={nameInput}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
    />
  )
}