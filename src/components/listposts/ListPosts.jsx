import React from 'react'
import { Post } from "../"
import "./listposts.css"

function ListPosts({ posts }) {
    return (
        <div>
            <br></br>
            <br></br>
            <div className='postlisting'>
                {posts.length &&
                    posts.map((post, i) => {
                        return (
                            <div key={i} className='postcard-holder'>
                                <div className="postcard">
                                    <h2>{post.title}</h2>
                                    <h5>Published on {post.published} {(post.updated !== null) ? '| Updated on ' + post.updated : ''} </h5>
                                    <Post postJSON={post}/>
                                </div>
                            </div>
                        )
                    })
                }
            </div>


            {/* */}
        </div>
    )
}

export default ListPosts
