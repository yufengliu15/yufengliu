import React from 'react'
import { useParams, Navigate } from 'react-router-dom';
import "./post.css"
import postsList from "../../posts.json"
import { Navbar, Logo } from "../"

// Markdown styling imports
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'

const Post = () => {
    const { title } = useParams();
    var post = null;

    for (var i in postsList) {
        if (postsList[i].title === title){
            post = postsList[i];
        }
    }
    if (post === null){
        console.log("what are you trying to do huh?")
        return <Navigate to="/"/>
    }
    
    const customStyle = {
        lineHeight: '1.5',
        fontSize: '1rem',
        borderRadius: '8px',
        backgroundColor: '#363636',
        padding: '20px'
    };

    return (
        <div>
            <Navbar></Navbar>
            <div className="markdown-body">
                <h1 className="title">{post.user_title}</h1>
                Published on {post.published} {(post.updated !== null) ? '| Updated on ' + post.updated : ''}
                <br></br>
                Read time: {post.readTime} minutes
                <br></br>
                <br></br>
                tags: {post.tags}
                <hr></hr>
                <Markdown className="markdown" remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]} components={{
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
                }}>{post.content}</Markdown>
            </div>
            <Logo></Logo>
        </div>

    )
};

export default Post
