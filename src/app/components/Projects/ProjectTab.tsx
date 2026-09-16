import { ProjectType } from "@/types/data"
import clsx from "clsx"

const ProjectTab = ({
  project,
  activeProject,
  setActiveProject
}: {
  project: ProjectType
  activeProject: ProjectType
  setActiveProject: (project: ProjectType) => void
}) => {
  const isActive = activeProject.projectId === project.projectId

  return (
    <button
      type="button"
      role="tab"
      id={`tabs-with-underline-item-${project.projectId}`}
      aria-selected={isActive}
      aria-controls={`tabs-with-underline-${project.projectId}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActiveProject(project)}
      className={clsx(
        "py-5 px-10 rounded-lg items-center gap-2 border border-white/10 -mb-px transition-all text-lg font-medium space-nowrap text-white w-full cursor-pointer",
        isActive && "bg-primary font-semibold"
      )}
    >
      {project.title}
    </button>
  )
}

export default ProjectTab
