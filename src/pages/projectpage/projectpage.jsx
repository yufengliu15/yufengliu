import React from 'react'
import './projectpage.css'
import { Logo } from '../../components'
import ProjectGrid from '../../components/projectgrid/ProjectGrid'
import projectsList from '../../projects.json'
import useAnimateRoute from '../../hooks/useAnimatedRoute'

function ProjectPage() {
  const animationClass = useAnimateRoute()
  
  return (
    <div className={animationClass}>
      <div className='projectpage-body'>
        <h1>Projects</h1>
        <hr></hr>
        <br></br>
        <p>I <s>try</s> like to build things. Here's some examples, in order from newest to oldest.</p>
        <br></br>
        There are currently <b>{projectsList.length}</b> project(s).
        <ProjectGrid projects={projectsList} />
      </div>
      <Logo></Logo>
    </div>
  )
}

export default ProjectPage
