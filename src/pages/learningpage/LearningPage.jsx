import React from 'react'

import './learningpage.css'
import { Logo, ListPosts } from '../../components'
import postList from "../../posts.json"

import useAnimateRoute from '../../hooks/useAnimatedRoute'

function LearningPage() {
  const animationClass = useAnimateRoute()
  return (
    <div className={animationClass}>
      <div className='learningpage-body'>
        <h1>Blogs</h1>
        <hr></hr>
        <br></br>
        There are currently <b>{postList.length}</b> post(s).
        <ListPosts posts={postList}></ListPosts>
      </div>
      <br></br>
      <br></br>
      <Logo></Logo>
    </div>
  )
}

export default LearningPage
