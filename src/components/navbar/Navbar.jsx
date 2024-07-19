import React from 'react'
import './navbar.css'

const Navbar = () => {
  return (
    <nav className="sticky">
      <div className='navbar'>
        <ul className='navbar-menu'>
          <li><a href="/">home</a></li>
          <li><a href="/blog">blog</a></li>
          <li><a href="gallery">gallery</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
