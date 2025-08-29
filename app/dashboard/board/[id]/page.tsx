import { BoardPage } from "./board-page"
import { getBoard } from "./get-board"

export default async function Board({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const board = await getBoard(id)

  return <BoardPage initBoard={board} />
}