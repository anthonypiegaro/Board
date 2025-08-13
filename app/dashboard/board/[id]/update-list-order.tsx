"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq, sql } from "drizzle-orm"

import { db } from "@/db/db"
import { board, project } from "@/db/schema"
import { auth } from "@/lib/auth"

type UpdateListOrder = {
  boardId: string
  lists: {
    listId: string
    orderNumber: number
  }[]
} 

export const updateListOrder = async ({ boardId, lists }: UpdateListOrder) => {
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
    .where(eq(board.id, boardId))
  
  if (projectRes.length === 0) {
    throw new Error("Board does not exists")
  }

  if (projectRes[0].userId !== userId) {
    throw new Error("You do not own this board. Cannot add list to board")
  }

  const valueTuples = lists.map(({ listId, orderNumber }) =>
    sql`(${listId}::uuid, ${orderNumber}::int)`
  )

  await db.execute(sql`
    UPDATE "list" AS l
    SET "order_number" = v.order_number
    FROM (VALUES ${sql.join(valueTuples, sql`, `)}) AS v(id, order_number)
    WHERE l.id = v.id
  `)
}