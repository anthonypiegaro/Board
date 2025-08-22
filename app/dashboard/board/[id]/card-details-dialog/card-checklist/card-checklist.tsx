"use client"

import { SquareCheckBig } from "lucide-react"

import { CardChecklistHeader, ChecklistNameChangeSchema } from "./card-checklist-header"
import { CardEntity } from "../../types"
import { ChecklistOptions } from "./checklist-options"

export type CardChecklistEntity = CardEntity & { type: "checklist" }

export function CardChecklist({
  checklist,
  onBlur,
  onFocus,
  onChecklistNameChange,
  onOpenDeleteChecklistDialog
}: {
  checklist: CardChecklistEntity
  onBlur: () => void
  onFocus: () => void
  onChecklistNameChange: (checklist: ChecklistNameChangeSchema) => void
  onOpenDeleteChecklistDialog: () => void
}) {
  return (
    <div className="w-full flex flex-col gap-x-4">
      <div className="flex items-center flex-nowrap gap-x-2">
        <SquareCheckBig className="w-4 h-4" />
        <CardChecklistHeader
          entityId={checklist.entityId}
          checklistId={checklist.checklistId}
          checklistName={checklist.name}
          onSuccess={onChecklistNameChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
        <ChecklistOptions 
          onOpenDeleteChecklistDialog={onOpenDeleteChecklistDialog}
        />
      </div>
    </div>
  )
}