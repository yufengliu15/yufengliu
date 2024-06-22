import React from 'react'
import { Post } from "../"
import "./listposts.css"
import { Link} from "react-router-dom"

function ListPosts({ posts }) {
    return (
        <div>
            <br></br>
            <br></br>
            <div className='postlisting'>
                {posts.length &&
                    posts.map((post, i) => {
                        return (
                            <div key={post.title} className='postcard-holder'>
                                <Link to={`/learning/${post.title}`}>
                                    <div className="postcard">
                                        <h2>{post.user_title}</h2>
                                        <h5>Published on {post.published} {(post.updated !== null) ? '| Updated on ' + post.updated : ''} </h5>
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default ListPosts
