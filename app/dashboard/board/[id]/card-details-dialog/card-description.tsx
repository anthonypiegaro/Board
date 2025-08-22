"use client"

import { ChangeEvent, useEffect, useRef, useState } from "react"

import { Textarea } from "@/components/ui/textarea"
import { Text } from "lucide-react"

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  const handleFocus = async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
    onFocus()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault()
      textareaRef.current?.blur()
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-x-2 mb-1">
        <Text className="w-4 h-4" />
        <p className="font-medium">Description</p>
      </div>
      <Textarea
        className="w-full max-w-full h-50 resize-none mb-2 break-all text-muted-foreground focus:text-primary"
        value={descriptionInput}
        onChange={handleDescriptionInputChange}
        onBlur={handleBlur}
        autoFocus={false}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        ref={textareaRef}
      />
      <p className="text-xs text-right text-muted-foreground">
        {descriptionInput.length}/5000
      </p>
    </div>
  )
}