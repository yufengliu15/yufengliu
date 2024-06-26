import React from 'react'
import { Image } from '../../assets'
import { ScrollIndicator } from '../'
import './introimage.css'

function IntroImage() {
  return (
    <div>
      <div className='image-container'>
        <img className="background-image" src={Image} alt="BackgroundImage" />
        <ScrollIndicator></ScrollIndicator>
      </div>
    </div>

  )
}

export default IntroImage
