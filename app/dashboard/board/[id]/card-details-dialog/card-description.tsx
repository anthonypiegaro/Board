"use client"

import { ChangeEvent, useEffect, useState } from "react"

import { Textarea } from "@/components/ui/textarea"

export function CardDescription({
  description,
  onChange
}: {
  description: string
  onChange: (description: string) => void 
}) {
  const [descriptionInput, setDescriptionInput] = useState(description)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setDescriptionInput(description)
  }, [description])

  const handleDescriptionInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value

    if (value.length <= 5000) {
      setDescriptionInput(value)
    }
  }

  const handleBlur = () => {
    if (descriptionInput.length <= 5000) {
      onChange(descriptionInput)
    }
  }

  return (
    <div className="w-full">
      <Textarea
        className="w-full h-50 resize-none mb-2"
        value={descriptionInput}
        onChange={handleDescriptionInputChange}
        onBlur={handleBlur}
        autoFocus={false}
      />
      <p className="text-xs text-right text-muted-foreground">
        {descriptionInput.length}/5000
      </p>
    </div>
  )
}