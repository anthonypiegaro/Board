import { getProjects } from "./get-projects";
import { ProjectList } from "./project-list";

export type Project = {
  id: string
  name: string
  boards: { id: string, name: string }[] 
}

export default async function Projects() {
  const projects = await getProjects()

  return (
    <div className="w-full h-full mt-5 mb-25">
      <div className="px-1 sm:px-2 md:px-4 lg:px-6 xl:px-8">
        <ProjectList initProjects={projects} />
      </div>
    </div>
  )
}