"use client"

import { ChangeEvent, useEffect, useState } from "react"

import { Textarea } from "@/components/ui/textarea"

export function CardDescription({
  description,
  onChange,
  onFocus,
  onBlur
}: {
  description: string
  onChange: (description: string) => void
  onFocus: () => void
  onBlur: () => void
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

  const handleBlur = async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
    if (descriptionInput.length <= 5000) {
      onChange(descriptionInput)
    }
    onBlur()
  }

  const handleFocus = () => {
    onFocus()
  }

  return (
    <div className="w-full">
      <Textarea
        className="w-full h-50 resize-none mb-2"
        value={descriptionInput}
        onChange={handleDescriptionInputChange}
        onBlur={handleBlur}
        autoFocus={false}
        onFocus={handleFocus}
      />
      <p className="text-xs text-right text-muted-foreground">
        {descriptionInput.length}/5000
      </p>
    </div>
  )
}