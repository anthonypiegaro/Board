import { ReactNode } from "react"
import { 
  Dice6,
  EllipsisVertical,
  Folder, 
  LayoutDashboard, 
  PanelLeft, 
  Plus,
  SquareCheck,
  SquareKanban,
  Text
} from "lucide-react"

import { cn } from "@/lib/utils"

export function Demo() {
  return (
    <div className="w-fit mx-auto border border-slate-50 rounded-xl p-4 backdrop-blur-md bg-gray-50/30">
      <div className="border border-slate-50 rounded-lg p-4 backdrop-blur-md bg-gray-50/20">
        <div className="relative bg-neutral-300 dark:bg-neutral-500 rounded-md h-150 w-[80dvw] md:w-[650px] lg:w-[950px] xl:w-[1150px] 2xl:w-[1250px] sm:p-3 lg:pl-40">
          <div className="max-lg:hidden absolute top-0 left-0 bottom-0 w-40 h-full pt-4 flex flex-col">
            <SquareKanban  className="mx-auto w-7 h-7 text-foreground"/>
            <div className="flex flex-col px-3 mt-4 text-sm font-medium">
              <div className="flex gap-x-2 pl-3 py-1 items-center rounded-md transition-all hover:bg-fuchsia-50 dark:hover:bg-fuchsia-400 cursor-pointer">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              <div className="flex gap-x-2 pl-3 py-1 items-center rounded-md transition-all hover:bg-fuchsia-50 dark:hover:bg-fuchsia-400 cursor-pointer">
                <Folder className="w-4 h-4" />
                <span>Projects</span>
              </div>
              <div className="flex gap-x-2 pl-3 py-1 items-center rounded-md bg-fuchsia-50 dark:bg-fuchsia-400 cursor-pointer">
                <Dice6 className="w-4 h-4" />
                <span>Boards</span>
              </div>
            </div>
          </div>
          <div className="h-full w-full bg-fuchsia-50 dark:bg-neutral-700 rounded-md border-2 border-fuchsia-200 dark:border-neutral-600">
            <div className="w-full flex gap-x-4 py-2 border-b-2 dark:border-neutral-600 items-center">
              <div className="ml-4 transition-all rounded-sm font-medium p-1 -mr-1 hover:bg-fuchsia-200/60 dark:hover:bg-fuchsia-400/60">
                <PanelLeft className="w-4 h-4" />
              </div>
              <div className="h-5 w-[2px] bg-neutral-300 dark:bg-neutral-600 rounded-sm" />
              <h2 className="font-semibold">
                Boards
              </h2>
            </div>
            <div className="flex gap-x-4 w-full h-full p-4 overflow-x-auto items-start">
              <div className="max-xl:hidden w-55 rounded-md bg-neutral-300 dark:bg-neutral-600 dark:border dark:border-neutral-500 shrink-0">
                <Header name="Backlog" />
                <BoardCardsContainer>
                  <BoardCard 
                    title="Set Up Auth"
                    hasDescription
                  />
                  <BoardCard 
                    title="Implement Landing Page"
                  />
                </BoardCardsContainer>
                <AddCardButton />
              </div>
              <div className="max-lg:hidden w-55 rounded-md bg-neutral-300 dark:bg-neutral-600 dark:border dark:border-neutral-500 shrink-0">
                <Header name="Next Up"/>
                <BoardCardsContainer>
                </BoardCardsContainer>
                <AddCardButton />
              </div>
              <div className="w-55 rounded-md bg-neutral-300 dark:bg-neutral-600 dark:border dark:border-neutral-500 shrink-0">
                <Header name="In Progress" />
                <BoardCardsContainer>
                  <BoardCard 
                    title="Configure Neon Database"
                    hasDescription
                    checklist={{ completed: 1, total: 3 }}
                  />
                  <BoardCard 
                    title="Set Up Component Library"
                    checklist={{ completed: 3, total: 15 }}
                  />
                </BoardCardsContainer>
                <AddCardButton />
              </div>
              <div className="w-55 rounded-md bg-neutral-300 dark:bg-neutral-600 dark:border dark:border-neutral-500 shrink-0 relative">
                <Header name="Completed" />
                <BoardCardsContainer className="relative">
                  <BoardCard 
                    title="Build Wireframe"
                    hasDescription
                    checklist={{ completed: 5, total: 5 }}
                  />
                  <BoardCard 
                    title="Build Data Model"
                    hasDescription
                    checklist={{ completed: 4, total: 4 }}
                    className="relative after:absolute after:-inset-1 after:bg-neutral-400 dark:after:bg-neutral-700 after:rounded-md"
                  />
                  <BoardCard 
                    title="Build Data Model"
                    hasDescription
                    checklist={{ completed: 4, total: 4 }}
                    className="absolute w-51 top-11 -left-20 rotate-5 hover:border-neutral-200 after:absolute after:-inset-1 after:bg-neutral-400/30 after:rounded-md after:pointer-events-auto"
                  />
                  <BoardCard 
                    title="Build Color Theme"
                    hasDescription
                    checklist={{ completed: 8, total: 8 }}
                  />
                  <BoardCard 
                    title="Define MVP"
                    hasDescription
                  />
                </BoardCardsContainer>
                <AddCardButton />
              </div>
              <div className="p-2 rounded-md bg-neutral-300 dark:bg-neutral-600 dark:border dark:border-neutral-500 shrink-0">
                <div className="flex items-center rounded-md hover:bg-fuchsia-100/80 transition-all gap-x-1 px-2 py-1 cursor-pointer">
                  <Plus className="w-4 h-4" />
                  <h3 className="font-semibold">
                    Add another list
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Header({
  name
}: { 
  name: string 
}) {
  return (
    <div className="w-full px-4 py-3 flex justify-between items-center">
      <h3 className="font-semibold">{name}</h3>
      <div className="p-1 hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-400/80 rounded-md transition-all">
        <EllipsisVertical className="w-4 h-4" />
      </div>
    </div>
  )
}

function AddCardButton() {
  return (
    <div className="px-2 py-2">
      <div className="flex items-center text-sm rounded-md hover:bg-fuchsia-100/80 dark:hover:bg-fuchsia-400/80 transition-all gap-x-1 px-2 py-1 cursor-pointer">
        <Plus className="w-4 h-4" />
        <h3 className="font-medium">
          Add a card
        </h3>
      </div>
    </div>
  )
}

function BoardCard({
  title,
  hasDescription=false,
  checklist,
  className
}: {
  title: string
  hasDescription?: boolean
  checklist?: { completed: number, total: number }
  className?: string
}) {
  return (
    <div className={cn("flex flex-col rounded-md border-3 border-transparent bg-neutral-200 dark:bg-neutral-700 dark:ring dark:ring-neutral-500 dark:border-2 hover:border-3 hover:border-neutral-50 dark:hover:border-neutral-500 transition-all text-muted-foreground px-2 py-1 cursor-pointer", className)}>
      <h4 className="text-sm font-semibold">
        {title}
      </h4>
      <div className="flex gap-x-2 items-center">
        {hasDescription && <Text className="w-4 h-4" />}
        {checklist && (
          <div className="flex items-center">
            <SquareCheck className="w-4 h-4" />
            <span className="text-xs">{checklist.completed}/{checklist.total}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function BoardCardsContainer({
  className,
  children
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2 px-2", className)}>
      {children}
    </div>
  )
}