import React from 'react'
import "./listposts.css"
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';


function ListPosts({ posts }) {
    const customStyle = {
        lineHeight: '1.5',
        fontSize: '1rem',
        borderRadius: '8px',
        backgroundColor: '#363636',
        padding: '20px'
    };

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
                                </div>
                            </div>
                        )
                    })
                }
            </div>


            {/* <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]} components={{
                code: function ({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');

                    return !inline && match ? (
                        <SyntaxHighlighter style={solarizedlight} customStyle={customStyle} PreTag="div" language={match[1]} {...props}>
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
            }}>{posts[0].content}</Markdown> */}
        </div>
    )
}

export default ListPosts
