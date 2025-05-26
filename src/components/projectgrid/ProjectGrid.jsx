import React from 'react'
import './projectgrid.css'
import ProjectCard from '../projectcard/ProjectCard'

function ProjectGrid({ projects }) {
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <div key={project.id} className="project-grid-item">
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  )
}

export default ProjectGrid 