"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { board, card, cardChecklist, cardEntity, list, project } from "@/db/schema"
import { auth } from "@/lib/auth"

import { CreateChecklistSchema } from "./create-checklist-dialog"

export const createChecklist = async (values: CreateChecklistSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  console.log(values)

  const projectRes = await db
    .select({
      userId: project.userId
    })
    .from(card)
    .innerJoin(list, eq(card.listId, list.id))
    .innerJoin(board, eq(list.boardId, board.id))
    .innerJoin(project, eq(board.projectId, project.id))
    .where(eq(card.id, values.cardId))
  
  if (projectRes.length === 0) {
    throw new Error("Project does not exist")
  }

  if (projectRes[0].userId !== userId) {
    throw new Error("You do not own this project. Cannot add card")
  }

  await db.transaction(async tx => {
    await tx.insert(cardEntity).values({
      id: values.entityId,
      cardId: values.cardId,
      type: "checklist",
      orderNumber: 0
    })

    await tx.insert(cardChecklist).values({
      id: values.id,
      cardEntityId: values.entityId,
      name: values.name
    })
  })
}