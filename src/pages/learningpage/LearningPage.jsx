import React from 'react'

import './learningpage.css'
import { Navbar, Logo, ListPosts } from '../../components'
import postList from "../../posts.json"

function LearningPage() {
  return (
    <div>
      <Navbar></Navbar>
      <div className='body'>
        <h1>Blog</h1>
        Welcome to my blog page! This page was made so that plog posts are written in Markdown, then using 'react-markdown' to translate it into JSX.
        <br></br>
        <br></br>
        There are currently <b>{postList.length}</b> posts.

        <ListPosts posts={postList}></ListPosts>
      </div>
      <br></br>
      <br></br>
      <Logo></Logo>
    </div>
  )
}

export default LearningPage
