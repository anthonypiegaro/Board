"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { eq, sql } from "drizzle-orm"

import { db } from "@/db/db"
import { board, card, list, project } from "@/db/schema"
import { auth } from "@/lib/auth"

export type UpdateCardListIdAndOrderValues = {
  cardId: string
  listId: string
  cards: {
    cardId: string
    orderNumber: number
  }[]
}

export const updateCardListIdAndOrder = async (values: UpdateCardListIdAndOrderValues) => {
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
    .where(eq(list.id, values.listId))
  
  if (projectRes.length === 0) {
    throw new Error("Board does not exists")
  }

  if (projectRes[0].userId !== userId) {
    throw new Error("You do not own this board. Cannot add list to board")
  }

  await db.transaction(async tx => {
    const updateCardListId = tx.update(card).set({ listId: values.listId }).where(eq(card.id, values.cardId))

    const valueTuples = values.cards.map(({ cardId, orderNumber }) =>
      sql`(${cardId}::uuid, ${orderNumber}::int)`
    )

    const updateCardOrderNumbers = tx.execute(sql`
      UPDATE "card" AS c
      SET "order_number" = v.order_number
      FROM (VALUES ${sql.join(valueTuples, sql`, `)}) AS v(id, order_number)
      WHERE c.id = v.id
    `)

    await Promise.all([
      updateCardListId,
      updateCardOrderNumbers
    ])
  })
}