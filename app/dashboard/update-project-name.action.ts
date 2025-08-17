"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { and, eq } from "drizzle-orm"

import { db } from "@/db/db"
import { project } from "@/db/schema"
import { auth } from "@/lib/auth"

export const updateProjectName = async ({ id, name }: { id: string, name: string }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  await db
    .update(project)
    .set({ name: name })
    .where(and(
      eq(project.id, id),
      eq(project.userId, userId)
    ))
}