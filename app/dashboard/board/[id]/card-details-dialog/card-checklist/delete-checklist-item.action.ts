"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { board, card, cardChecklist, cardChecklistItem, cardEntity, list, project } from "@/db/schema"
import { auth } from "@/lib/auth"

export const deleteChecklistItem = async (checklistItemId: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  const projectRes = await db
    .select({
      userId: project.userId
    })
    .from(cardChecklistItem)
    .innerJoin(cardChecklist, eq(cardChecklistItem.cardChecklistId, cardChecklist.id))
    .innerJoin(cardEntity, eq(cardChecklist.cardEntityId, cardEntity.id))
    .innerJoin(card, eq(cardEntity.cardId, card.id))
    .innerJoin(list, eq(card.listId, list.id))
    .innerJoin(board, eq(list.boardId, board.id))
    .innerJoin(project, eq(board.projectId, project.id))
    .where(eq(cardChecklistItem.id, checklistItemId))
  
  if (projectRes.length === 0) {
    throw new Error("Project does not exist")
  }

  if (projectRes[0].userId !== userId) {
    throw new Error("You do not own this project. Cannot add card")
  }

  await db.delete(cardChecklistItem).where(eq(cardChecklistItem.id, checklistItemId))
}