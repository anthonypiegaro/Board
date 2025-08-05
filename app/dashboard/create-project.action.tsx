"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { db } from "@/db/db"
import { project } from "@/db/schema"
import { auth } from "@/lib/auth"

import { CreateProjectSchema } from "./create-project-dialog"

export const createProject = async (values: CreateProjectSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  await db.insert(project).values({
    id: values.id,
    userId,
    name: values.name
  })
}