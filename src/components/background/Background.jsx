import React, { useEffect, useState } from 'react'
import './background.css'

const Background = () => {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  // // useEffect(() => {
  // //   function handleResize() {
  // //     setDimensions({
  // //       height: window.innerHeight,
  // //       width: window.innerWidth,
  // //     });
  // //   }

  // //   window.addEventListener('resize', handleResize);

  // //   return () => {
  // //     window.removeEventListener('resize', handleResize);
  // //   };
  // // }, []);

  const elements = [];

  // console.log("height: %d", dimensions.height)
  // console.log("width: %d", dimensions.width)

  for (let i = 0; i < dimensions.height / 75; i++) {
    for (let j = 0; j < dimensions.width / 75; j++) {
      // if (dimensions.width % 75){
        elements.push(<div className="background-element" key={`${i}-${j}`}>+</div>);
      // } else {
        // elements.push(<div className="background-element" key={`${i}-${j}`}> </div>);
      // }
    }
  }

  console.log(elements)

  return (
    <div className='background'>
      {elements}
    </div>
  )
}

export default Background
