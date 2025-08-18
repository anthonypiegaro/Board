"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { project } from "@/db/schema"
import { auth } from "@/lib/auth"

export const deleteProject = async (projectId: string) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  await db.delete(project).where(and(
    eq(project.id, projectId),
    eq(project.userId, userId)
  ))
}