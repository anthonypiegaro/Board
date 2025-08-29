"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq, sql } from "drizzle-orm"

import { db } from "@/db/db"
import { board, card, cardChecklist, cardChecklistItem, cardEntity, list, project } from "@/db/schema"
import { auth } from "@/lib/auth"

export type UpdateChecklistItemOrderSchema = {
  checklistId: string
  items: {
    itemId: string
    orderNumber: number
  }[]
}

export const updateChecklistItemOrder = async (values: UpdateChecklistItemOrderSchema) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect("/")
  }

  const userId = session.user.id

  const projectRes = await db
    .select({ userId: project.userId })
    .from(cardChecklist)
    .innerJoin(cardEntity, eq(cardChecklist.cardEntityId, cardEntity.id))
    .innerJoin(card, eq(cardEntity.cardId, card.id))
    .innerJoin(list, eq(card.listId, list.id))
    .innerJoin(board, eq(list.boardId, board.id))
    .innerJoin(project, eq(board.projectId, project.id))
    .where(eq(cardChecklist.id, values.checklistId))

  if (projectRes.length === 0) {
    throw new Error("Project does not exist")
  }

  if (projectRes[0].userId !== userId) {
    throw new Error("You do not own this project. Cannot add card")
  }

  const itemOrderTuples = values.items.map(({ itemId, orderNumber }) => 
    sql`(${itemId}::uuid, ${orderNumber}::int)`
  )

  await db.execute(sql`
    UPDATE "card_checklist_item" AS i
    SET "order_number" = v.order_number
    FROM (VALUES ${sql.join(itemOrderTuples, sql`, `)}) AS v(id, order_number)
    WHERE i.id = v.id
  `)
}