"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { project, board } from "@/db/schema"
import { auth } from "@/lib/auth"

import { CreateBoardSchema } from "./create-board-dialog"

export const createBoard = async (values: CreateBoardSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  const projectRes = await db.select({ userId: project.userId }).from(project).where(eq(project.id, values.projectId))

  if (projectRes.length === 0) {
    throw new Error("Project does not exist")
  }

  if (projectRes[0].userId !== userId) {
    throw new Error("Project is not owned by you")
  }

  await db.insert(board).values({
    id: values.id,
    projectId: values.projectId,
    name: values.name
  })
}