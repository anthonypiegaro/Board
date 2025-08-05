"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

import { db } from "@/db/db"
import { project, board } from "@/db/schema"
import { auth } from "@/lib/auth"

import { Project } from "./page"

export const getProjects = async (): Promise<Project[]> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  const data = await db
    .select({
      id: project.id,
      name: project.name,
      boardId: board.id,
      boardName: board.name
    })
    .from(project)
    .leftJoin(board, eq(project.id, board.projectId))
    .where(eq(project.userId, userId))

  const projects = data.reduce((acc, project) => {
    if (!(project.id in acc)) {
      acc[project.id] = {
        id: project.id,
        name: project.name,
        boards: []
      }
    }

    if (project.boardId !== null && project.boardName !== null) {
      acc[project.id].boards.push({
        id: project.boardId,
        name: project.boardName
      })
    }
  
    return acc
  }, {} as Record<string, Project>)

  return Object.values(projects)
}