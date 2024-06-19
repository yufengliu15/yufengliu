import React from 'react'
import { Image } from '../../assets'
import './introimage.css'

function IntroImage() {
  return (
    <div>
      <div className='image-container'>
        <img className="background-image" src={Image} alt="BackgroundImage" />

      </div>
    </div>

  )
}

export default IntroImage
