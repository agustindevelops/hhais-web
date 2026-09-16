"use client"
import ProjectTab from "./ProjectTab"
import { ProjectsData } from "@/app/pages/index-5/data"
import { ProjectType } from "@/types/data"
import { useState } from "react"
import Project from "./Project"

const Projects = () => {
  const [activeProject, setActiveProject] = useState<ProjectType>(ProjectsData[0])

  return (
    <section id="projects" className="pb-20 pt-40" data-aos="zoom-in" data-aos-easing="ease" data-aos-duration={1000}>
      <h2 className="text-4xl font-bold text-center text-primary mb-10">Check Out Our Projects</h2>
      <div className="container">
        <div className="border rounded-2xl border-white/10 bg-slate-950/40">
          <div className="p-6">
            <div>
              <nav className="flex flex-wrap 2xl:flex-nowrap items-center gap-6 justify-evenly rounded-md p-2" aria-label="Tabs" role="tablist">
                {ProjectsData.map((project) => (
                  <ProjectTab key={project.title} project={project} activeProject={activeProject} setActiveProject={setActiveProject} />
                ))}
              </nav>
              <div className="mt-10 overflow-hidden">
                <Project project={activeProject} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



export default Projects
