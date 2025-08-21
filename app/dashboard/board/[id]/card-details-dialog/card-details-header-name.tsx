"use client"

import { ChangeEvent, useEffect, useState } from "react"

import { cn } from "@/lib/utils"

export function CardDetailsHeaderName({
  cardId,
  name,
  onNameChange,
  onFocus,
  onBlur
}: {
  cardId: string
  name: string
  onNameChange: (name: string) => void
  onFocus: () => void
  onBlur: () => void
}) {
  const [nameInput, setNameInput] = useState(name)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setNameInput(name)
  }, [name])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    if (value.length === 0) {
      setNameInput(value)
      setIsError(true)
    } else if (value.length > 300) {
      // do nothing
    } else {
      setIsError(false)
      setNameInput(value)
    }
  }

  const handleBlur = async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
    if (!isError) {
      onNameChange(nameInput)
    }
    onBlur()
  }

  const handleFocus = async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
    onFocus()
  }

  return (
    <input 
      className={cn(
        "transition-all flex-1 p-1 text-lg font-medium truncate ring ring-[3px] ring-transparent border border-transparent rounded-md focus:outline-none focus:ring-ring/50 focus:dark:ring-transparent focus:border-ring focus:dark:bg-input/30",
        isError && "border-destructive focus:border-destructive focus:ring-destructive/10 dark:bg-input/30"
      )}
      value={nameInput}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  )
}