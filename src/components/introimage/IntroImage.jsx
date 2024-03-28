import React from 'react'
import Image from '../../assets/introbackground.jpeg'
import './introimage.css'

function IntroImage() {
  return (
    <div>
      <div className='image'>
        <img className="background-image" height="475px" src={Image} alt="BackgroundImage" />
        </div>
      
    </div>
  )
}

export default IntroImage
