export default async function Board({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // function that grabs the data

  return <div>Board Id: {id}</div>
}