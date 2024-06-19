import React from 'react'

import './learningpage.css'
import { Navbar, Logo } from '../../components'

function LearningPage() {
  return (
    <div>
      <Navbar></Navbar>
      <div className='body'>
        <h1>Blog</h1>
        Welcome to my blog page!
      </div>
      <br></br>
      <br></br>
      <Logo></Logo>
    </div>
  )
}

export default LearningPage
