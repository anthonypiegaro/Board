"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq, inArray } from "drizzle-orm"

import { db } from "@/db/db"
import { 
  project,
  board, 
  list, 
  card, 
  cardEntity, 
  cardChecklist, 
  cardChecklistItem 
} from "@/db/schema"
import { auth } from "@/lib/auth"

import { Board } from "./types"

export const getBoard = async (id: string): Promise<Board> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  const boardAndLists = await db.select({
    id: board.id,
    name: board.name,
    listId: list.id,
    listName: list.name,
    listOrderNumber: list.orderNumber
  })
  .from(board)
  .innerJoin(project, eq(board.projectId, project.id))
  .leftJoin(list, eq(board.id, list.boardId))
  .where(and(
    eq(board.id, id),
    eq(project.userId, userId)
  ))

  if (boardAndLists.length === 0) {
    redirect("/dashboard/board/not-found")
  }

  const boardResult: Board = {
    id: boardAndLists[0].id,
    name: boardAndLists[0].name,
    lists: []
  }

  const listIds = boardAndLists.map(item => item.listId).filter(id => id !== null)

  if (listIds.length === 0) {
    return boardResult
  }

  const cards = await db.select().from(card).where(inArray(card.listId, listIds))

  if (cards.length === 0) {
    boardResult.lists = boardAndLists
      .map(bnl => {

        if (bnl.listId !== null && bnl.listName !== null && bnl.listOrderNumber !== null) {
          return ({
            id: bnl.listId,
            name: bnl.listName,
            orderNumber: bnl.listOrderNumber,
            cards: []
          })
        }

        return null
      }).filter(list => list !== null)
    
    boardResult.lists.sort((a, b) => a.orderNumber - b.orderNumber)

    return boardResult
  }

  const cardIds = cards.map(c => c.id)

  const cardEntitiesRes = await db.select().from(cardEntity).where(inArray(cardEntity.cardId, cardIds))

  if (cardEntitiesRes.length === 0) {
    const listById = boardAndLists.reduce((acc, list) => {
      if (list.listId !== null && list.listName !== null && list.listOrderNumber !== null) {
        acc[list.listId] = {
          id: list.listId,
          name: list.listName,
          orderNumber: list.listOrderNumber,
          cards: []
        }
      }

      return acc
    }, {} as Record<string, {
      id: string
      name: string
      orderNumber: number
      cards: {
        id: string
        name: string
        description: string
        orderNumber: number
        cardEntities: []
      }[]
    }>)

    for (const card of cards) {
      listById[card.listId].cards.push({
        id: card.id,
        name: card.name,
        description: card.description,
        orderNumber: card.orderNumber,
        cardEntities: []
      })
    }

    Object.values(listById).forEach(list => {
      boardResult.lists.push(list)
      list.cards.sort((a, b) => a.orderNumber - b.orderNumber)
    })

    boardResult.lists.sort((a, b) => a.orderNumber - b.orderNumber)

    return boardResult
  }

  const allCardEntitiesPre = cardEntitiesRes.reduce((acc, entity) => {
    acc[entity.id] = {
      cardId: entity.cardId,
      entityId: entity.id,
      orderNumber: entity.orderNumber
    }
    return acc
  }, {} as Record<string, {
    entityId: string
    orderNumber: number
    cardId: string
  }>)

  const checklistEntitiesEntityIds = cardEntitiesRes
    .filter(entity => entity.type === "checklist")
    .map(entity => entity.id)
  
  const checklistRes = await db.select().from(cardChecklist).where(inArray(cardChecklist.cardEntityId, checklistEntitiesEntityIds))

  const checklists = checklistRes.reduce((acc, checklist) => {
    acc[checklist.id] = {
      id: checklist.id,
      name: checklist.name,
      type: "checklist",
      checklistItems: [],
      entityId: checklist.cardEntityId
    }
    return acc
  }, {} as Record<string, {
    id: string
    name: string
    type: "checklist",
    checklistItems: {
      id: string
      name: string
      completed: boolean
      orderNumber: number
    }[],
    entityId: string
  }>)

  const checklistIds = checklistRes.map(checklist => checklist.id)

  const checklistItems = await db.select().from(cardChecklistItem).where(inArray(cardChecklistItem.cardChecklistId, checklistIds))

  for (const item of checklistItems) {
    checklists[item.cardChecklistId].checklistItems.push({
      id: item.id,
      name: item.name,
      completed: item.completed,
      orderNumber: item.orderNumber
    })
  }

  const allCardEntitiesPost: Record<string, {
    entityId: string
    orderNumber: number
    cardId: string
    checklistId: string
    name: string
    type: "checklist"
    checklistItems: {
      id: string
      name: string
      completed: boolean
      orderNumber: number
    }[]
  }> = {}

  for (const checklist of Object.values(checklists)) {
    checklist.checklistItems.sort((a, b) => a.orderNumber - b.orderNumber)

    allCardEntitiesPost[checklist.entityId] = {
      entityId: checklist.entityId,
      orderNumber: allCardEntitiesPre[checklist.entityId].orderNumber,
      cardId: allCardEntitiesPre[checklist.entityId].cardId,
      checklistId: checklist.id,
      name: checklist.name,
      type: "checklist",
      checklistItems: checklist.checklistItems
    } 
  }

  const allCards = cards.reduce((acc, c) => {
    acc[c.id] = {
      listId: c.listId,
      cardId: c.id,
      name: c.name,
      description: c.description,
      orderNumber: c.orderNumber,
      cardEntities: []
    }
    return acc
  }, {} as Record<string, {
    listId: string
    cardId: string
    name: string
    description: string
    orderNumber: number
    cardEntities: {
      entityId: string
      orderNumber: number
      cardId: string
      checklistId: string
      name: string
      type: "checklist"
      checklistItems: {
        id: string
        name: string
        completed: boolean
        orderNumber: number
      }[]
    }[]
  }>)

  for (const entity of Object.values(allCardEntitiesPost)) {
    allCards[entity.cardId].cardEntities.push(entity)
  }

  const allLists = boardAndLists.reduce((acc, bnl) => {
    if (bnl.listId !== null && bnl.listName !== null && bnl.listOrderNumber !== null) {
      acc[bnl.listId] = {
        id: bnl.listId,
        name: bnl.listName,
        orderNumber: bnl.listOrderNumber,
        cards: []
      }
    }
  
    return acc
  }, {} as Record<string, {
    id: string
    name: string
    orderNumber: number
    cards: {
      cardId: string
      name: string
      description: string
      orderNumber: number
      cardEntities: {
        entityId: string
        orderNumber: number
        cardId: string
        checklistId: string
        name: string
        type: "checklist"
        checklistItems: {
          id: string
          name: string
          completed: boolean
          orderNumber: number
        }[]
      }[]
    }[]
  }>)

  for (const c of Object.values(allCards)) {
    allLists[c.listId].cards.push(c)

    c.cardEntities.sort((a, b) => a.orderNumber - b.orderNumber)
  }

  const lists = Object.values(allLists)

  boardResult.lists = lists.map(list => {
    return ({
      id: list.id,
      name: list.name,
      orderNumber: list.orderNumber,
      cards: list.cards.map(card => ({
        id: card.cardId,
        name: card.name,
        description: card.description,
        orderNumber: card.orderNumber,  
        cardEntities: card.cardEntities.map(entity => ({
          entityId: entity.entityId,
          orderNumber: entity.orderNumber,
          checklistId: entity.checklistId,
          name: entity.name,
          type: "checklist",
          checklistItems: entity.checklistItems
        }))
      }))
    })
  })

  boardResult.lists.sort((a, b) => a.orderNumber - b.orderNumber)

  return boardResult
}