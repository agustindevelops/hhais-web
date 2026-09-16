import Image from "next/image"
import { ProjectType } from "@/types/data"
import ButtonCTA from "@/components/ButtonCTA"

const Project = ({ project }: { project: ProjectType }) => {
  return (
    <div
      id={`tabs-with-underline-${project.projectId}`}
      className="transition-all duration-300 transform"
      role="tabpanel"
      aria-labelledby={`tabs-with-underline-item-${project.projectId}`}
    >
      <div className="grid xl:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-white/10">
          <h2 className="text-3xl font-medium text-primary brightness-125">{project.subTitle}</h2>
            {project.content.map((content, index) => (
              <p key={index} className="text-base font-medium text-default-200 mt-5">{content}</p>
            ))}
        </div>
        {project.image && (
          <div className="p-6 rounded-xl border border-white/10 flex flex-col justify-center items-center">
            <Image src={project.image} className="rounded-md" alt={project.title} />
            {project.cta ? (
            <div className="mt-4 mx-auto w-full flex justify-center flex-col items-center">
              <p className="text-base font-medium text-default-200 mb-4 text-center">{project.cta.hook}</p>
                <ButtonCTA href={project.cta.url} label={project.cta.label} icon={project.cta.icon} />
              </div>
            ) : <></>}
          </div>
        )}
      </div>
    </div>
  )
}

export default Project
