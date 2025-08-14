"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { board, project } from "@/db/schema"
import { auth } from "@/lib/auth"

export type UpdateBoardName = {
  boardId: string
  name: string
}

export const updateBoardName = async (values: UpdateBoardName) => {
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

  await db.update(board).set({ name: values.name }).where(eq(board.id, values.boardId))
}