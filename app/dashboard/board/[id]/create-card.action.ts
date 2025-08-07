"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { board, card, list, project } from "@/db/schema"
import { auth } from "@/lib/auth"

import { CreateCardSchema } from "./create-card-dialog"

export const createCard = async (values: CreateCardSchema) => {
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
    .from(list)
    .innerJoin(board, eq(list.boardId, board.id))
    .innerJoin(project, eq(board.projectId, project.id))
    .where(eq(list.id, values.listId))
  
  if (projectRes.length === 0) {
    throw new Error("Project does not exist")
  }

  if (projectRes[0].userId !== userId) {
    throw new Error("You do not own this project. Cannot add card")
  }

  await db.insert(card).values({
    id: values.id,
    listId: values.listId,
    name: values.name,
    description: values.description,
    orderNumber: values.orderNumber
  })
}