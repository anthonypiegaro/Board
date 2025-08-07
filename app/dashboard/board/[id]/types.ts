export type ChecklistItem = {
  id: string
  name: string
  completed: boolean
  orderNumber: number
}

export type CardChecklist = {
  checklistId: string
  name: string
  type: "checklist"
  checklistItems: ChecklistItem[]
}

export type CardEntity = { entityId: string, orderNumber: number } & CardChecklist

export type Card = {
  id: string
  name: string
  description: string
  orderNumber: number
  cardEntities: CardEntity[]
}

export type List = {
  id: string
  name: string
  orderNumber: number
  cards: Card[]
}

export type Board = {
  id: string
  name: string
  lists: List[]
}