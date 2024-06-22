import React from 'react'
import './navbar.css'

const Navbar = () => {
  return (
    <nav className="sticky">
      <div className='navbar'>
        <ul className='navbar-menu'>
          <li><a href="/">Home</a></li>
          {/* <li><a href="project">Projects</a></li> */}
          <li><a href="/learning">Learning</a></li>
          <li><a href="gallery">Gallery</a></li>
        </ul>

        <hr></hr>
      </div>
    </nav>
  )
}

export default Navbar
