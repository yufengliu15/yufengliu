import React from 'react'
import {Image} from '../../assets'
import './introimage.css'

function IntroImage() {
  return (
    <div>
      <div className='image-container'>
        <img className="background-image" src={Image} alt="BackgroundImage" />
        <div className='image-text-container'>
          <div className='header-container'>
            Hi, I'm <b>Yufeng</b>
          </div>
          <div className='text-container'>
            a software developer
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default IntroImage
