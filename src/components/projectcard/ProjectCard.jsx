import React, { useState, useEffect } from 'react'
import './projectcard.css'

function ProjectCard({ project }) {
  const [imageSrc, setImageSrc] = useState(null)

  useEffect(() => {
    // Dynamically import the image
    import(`../../assets/images/${project.image}`)
      .then(image => setImageSrc(image.default))
      .catch(err => {
        console.error(`Failed to load image: ${project.image}`, err)
        setImageSrc(null)
      })
  }, [project.image])

  return (
    <div className="project-card">
      <div className="project-image">
        {imageSrc ? (
          <img src={imageSrc} alt={project.title} />
        ) : (
          <div className="image-placeholder">
            <span>Image not found</span>
          </div>
        )}
      </div>
      <div className="project-content">
        <h2>{project.title}</h2>
        <p className="project-description">{project.description}</p>
        <div className="project-technologies">
          {project.technologies.map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>
        <div className="project-footer">
          <span className="project-date">{project.date}</span>
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
            View Project →
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard 