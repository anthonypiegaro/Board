"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { board, list, project } from "@/db/schema"
import { auth } from "@/lib/auth"

export const deleteList = async (id: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  const projectRes = await db
    .select({ userId: project.userId })
    .from(list)
    .innerJoin(board, eq(list.boardId, board.id))
    .innerJoin(project, eq(board.projectId, project.id))
    .where(eq(list.id, id))
  
  if (projectRes.length === 0) {
    throw new Error("Project does not exist")
  }

  if (projectRes[0].userId !== userId) {
    throw new Error("You do not have permission to edit")
  }

  await db.delete(list).where(eq(list.id, id))
}