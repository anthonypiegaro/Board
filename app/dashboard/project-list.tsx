"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Folder, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { Project } from "./page"
import { CreateProjectDialog, CreateProjectSchema } from "./create-project-dialog"
import { CreateBoardDialog } from "./create-board-dialog"

const gradient = [
  "from-indigo-300 to-fuchsia-600",
  "from-fuchsia-400 to-fuchsia-700",
  "from-purple-500 to-rose-800",
  "from-blue-600 to-purple-900",
]

export function ProjectList({
  initProjects
}: {
  initProjects: Project[]
}) {
  const [projects, setProjects] = useState<Project[]>(initProjects)
  const [projectNameFilter, setProjectNameFilter] = useState("")
  const [createProjectDialogOpen, setCreateProjectDialogOpen] = useState(false)
  const [currentCreateBoardProjectId, setCurrentCreateBoardProjectId] = useState("")

  const filteredProjects = useMemo(() => {
    return projects.filter(project => project.name.toLowerCase().includes(projectNameFilter.toLowerCase()))
  }, [projects, projectNameFilter])

  const handleProjectCreation = (values: CreateProjectSchema) => {
    setProjects(prev => [
      {
        id: values.id,
        name: values.name,
        boards: []
      }, 
      ...prev
    ])

    setCreateProjectDialogOpen(false)
  }

  const handleCreateBoardDialogOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentCreateBoardProjectId("")
    }
  }

  const createBoardDialogOpen = currentCreateBoardProjectId !== ""

  return (
    <>
      <CreateProjectDialog 
        open={createProjectDialogOpen}
        onOpenChange={setCreateProjectDialogOpen}
        onSuccess={handleProjectCreation}
      />
      <CreateBoardDialog 
        open={createBoardDialogOpen}
        onOpenChange={handleCreateBoardDialogOpenChange}
        projectId={currentCreateBoardProjectId}
      />
      <div className="w-full px-2 pb-10">
        <div className="w-full flex gap-4 my-10">
          <Input className="grow max-w-lg" placeholder="Search for project..."/>
          <Button className="shrink-0" onClick={() => setCreateProjectDialogOpen(true)}>
            <Plus />
            Add Project
          </Button>
        </div>
        <div className="w-full flex flex-col gap-7">
          {filteredProjects.map(project => (
            <div key={project.id}>
              <div className="w-full border-b mb-4">
                <h3 className="text-xl font-medium">
                  {project.name}
                </h3>
              </div>
              <div className="flex flex-wrap max-md:flex-nowrap max-md:w-full max-md:max-w-full max-md:overflow-x-scroll gap-4">
                {project.boards.map((board, i) => {
                  const colorGradient = gradient[i % 4]
                  return (
                    <a href={`/dashboard/board/${board.id}`} key={board.id} className="shrink-0 transition-all duration-150 ring-3 ring-transparent hover:ring-border flex flex-col overflow-hidden w-50 h-50 rounded-md bg-neutral-300 dark:bg-neutral-600">
                      <div className={cn("grow bg-gradient-to-tr", colorGradient)} />
                      <p className="shrink-0 p-2">
                        {board.name}
                      </p>
                    </a>
                  )
                })}
                <div onClick={() => setCurrentCreateBoardProjectId(project.id)} className="group cursor-pointer shrink-0 transition-all duration-150 ring-3 ring-transparent hover:ring-border flex flex-col overflow-hidden w-50 h-50 rounded-md bg-neutral-300 dark:bg-neutral-600">
                  <div className="grow bg-gradient-to-tr from-slate-400 to-slate-800" />
                  <p className="group-hover:text-muted-foreground transition-all duration-150 shrink-0 p-2 flex gap-x-1">
                    <Plus />
                    Build new board
                  </p>
                </div>
              </div>
            </div>
          ))}
          {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {projects.length === 0 ? (
                <div>
                  <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Your workspace is empty</p>
                  <p className="text-sm">Add your first project to get started!</p>
                </div>
              ) : (
                <div>
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No items found</p>
                  <p className="text-sm">Try adjusting your search</p>
                </div>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  )
}