import React from 'react'
import "./post.css"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { solarizedlight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css'

function Post(postJSON) {
    const customStyle = {
        lineHeight: '1.5',
        fontSize: '1rem',
        borderRadius: '8px',
        backgroundColor: '#363636',
        padding: '20px'
    };
    const post = postJSON.postJSON
    const title = post.title;

    return (
        <div>
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
    )
}

export default Post
