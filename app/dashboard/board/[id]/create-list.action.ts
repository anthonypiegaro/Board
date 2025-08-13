"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { board, list, project } from "@/db/schema"
import { auth } from "@/lib/auth"

import { CreateListSchema } from "./create-list-dialog"

export const createList = async (values: CreateListSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  const projectRes = await db
    .select({ userId: project.userId })
    .from(board)
    .innerJoin(project, eq(board.projectId, project.id))
    .where(eq(board.id, values.boardId))
  
  if (projectRes.length === 0) {
    throw new Error("Board does not exists")
  }

  if (projectRes[0].userId !== userId) {
    throw new Error("You do not own this board. Cannot add list to board")
  }

  await db.insert(list).values({
    boardId: values.boardId,
    orderNumber: values.orderNumber,
    id: values.id,
    name: values.name
  })
}