import React from 'react'

import { LogoSrc } from '../../assets'
import './logo.css'

function Logo() {
  return (
    <div>
        <div className='logo'>
          <img className="logo-img"src={LogoSrc}></img>
        </div>
    </div>
  )
}

export default Logo
