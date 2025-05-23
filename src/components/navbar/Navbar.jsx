import React from 'react'
import './navbar.css'

const Navbar = () => {
  return (
      <div className='navbar'>
        yufengliu.tech |
        <a href="/"> <b>home</b> </a>
        {/* <a href="/blog"> <b>blog</b> </a> */}
        <a href="/projects"><b>projects</b></a>
        <a href="/gallery"> <b>gallery</b> </a>
      </div>
  )
}

export default Navbar
