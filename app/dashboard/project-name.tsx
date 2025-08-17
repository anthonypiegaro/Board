"use client"

import { useState, useEffect, ChangeEvent } from "react"

import { cn } from "@/lib/utils"
import { updateProjectName } from "./update-project-name.action"

export function ProjectName({
  projectId,
  projectName,
  onSuccess
}: {
  projectId: string
  projectName: string
  onSuccess: ({ id, name }: { id: string, name: string }) => void
}) {
  const [nameInput, setNameInput] = useState(projectName)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setNameInput(projectName)
  }, [projectName])

  const handleNameInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value.length === 0) {
      setIsError(true)
      setNameInput(value)
    } else if (value.length > 150) {
      return
    } else {
      setNameInput(value)
      setIsError(false)
    }
  }

  const handleBlur = () => {
    if (!isError && nameInput !== projectName) {
      updateProjectName({ 
        id: projectId,
        name: nameInput
      })

      onSuccess({
        id: projectId,
        name: projectName
      })
    }
  }

  return (
    <input 
      className={cn(
        "text-xl font-medium border-2 border-transparent rounded-md py-2 min-w-150 focus:outline-none focus:bg-input",
        isError && "border-destructive bg-input"
      )}
      value={nameInput}
      onChange={handleNameInputChange}
      onBlur={handleBlur}
    />
  )
}