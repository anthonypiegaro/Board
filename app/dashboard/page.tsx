import { ProjectList } from "./project-list";

export type Project = {
  id: string
  name: string
  boards: { id: string, name: string }[] 
}

export const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    boards: [
      { id: 'board-1', name: 'UI/UX' },
      { id: 'board-2', name: 'Frontend' },
      { id: 'board-3', name: 'Backend' }
    ]
  },
  {
    id: 'proj-2',
    name: 'Mobile App Launch',
    boards: [
      { id: 'board-4', name: 'Planning' },
      { id: 'board-5', name: 'Development' }
    ]
  },
  {
    id: 'proj-3',
    name: 'Marketing Campaign',
    boards: [
      { id: 'board-6', name: 'Content' },
      { id: 'board-7', name: 'Social Media' },
      { id: 'board-8', name: 'Analytics' },
      { id: 'board-9', name: 'Design' }
    ]
  },
  {
    id: 'proj-4',
    name: 'Internal Tools',
    boards: [
      { id: 'board-10', name: 'Feature Requests' }
    ]
  },
  {
    id: 'proj-5',
    name: 'Customer Portal',
    boards: [
      { id: 'board-11', name: 'Bugs' },
      { id: 'board-12', name: 'Improvements' },
      { id: 'board-13', name: 'Support' }
    ]
  }
];

export default function Projects() {
  return (
    <div className="w-full h-full mt-5 mb-25">
      <div className="container mx-auto">
        <ProjectList initProjects={projects} />
      </div>
    </div>
  )
}