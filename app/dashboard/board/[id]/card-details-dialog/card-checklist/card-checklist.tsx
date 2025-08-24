"use client"

import { Plus, SquareCheckBig } from "lucide-react"

import { Button } from "@/components/ui/button"

import { CardChecklistHeader, ChecklistNameChangeSchema } from "./card-checklist-header"
import { CardEntity } from "../../types"
import { ChecklistOptions } from "./checklist-options"
import { CardChecklistItemList } from "./card-checklist-item-list"

export type CardChecklistEntity = CardEntity & { type: "checklist" }

export function CardChecklist({
  checklist,
  onBlur,
  onFocus,
  onChecklistNameChange,
  onOpenDeleteChecklistDialog,
  onOpenAddChecklistItemDialog,
  onCheckboxClick
}: {
  checklist: CardChecklistEntity
  onBlur: () => void
  onFocus: () => void
  onChecklistNameChange: (checklist: ChecklistNameChangeSchema) => void
  onOpenDeleteChecklistDialog: () => void
  onOpenAddChecklistItemDialog: () => void
  onCheckboxClick: ({ checklistItemId, checklistItemCompleted }: { checklistItemId: string, checklistItemCompleted: boolean }) => void
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
      <CardChecklistItemList 
        items={checklist.checklistItems}
        onCheckboxClick={onCheckboxClick}
      />
      <Button 
        variant="ghost" 
        className="flex self-start items-center justify-start rounded-md hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-400/80 transition-all gap-x-1 px-2 py-1 cursor-pointer"
        onClick={onOpenAddChecklistItemDialog}
      >
        <Plus className="w-4 h-4" />
        <h3 className="font-medium">
          Add an item
        </h3>
      </Button>
    </div>
  )
}