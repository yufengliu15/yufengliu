import React from 'react'
import { Logo } from '../../components'
import "./homepage.css"
import { Resume, Link } from '../../assets';

import useAnimateRoute from '../../hooks/useAnimatedRoute';

function HomePage() {
    const animationClass = useAnimateRoute()

    // DD/MM/YYYY
    let lastModifiedWebsiteDate = "14/06/2026";
    let lastModifiedResumeDate = "01/01/2026";

    const linkSize = "14px";

    return (
        <div className={animationClass}>
            <div className="homepage">
                <div className="text-area">
                    <div className="header">
                        <u>Hey!</u>
                    </div>

                    I'm Yufeng, a fourth year <b>Honours Computer Science </b> student at Carleton University located in Ottawa, Ontario.
                    A lot of things interest me, ranging from programming, AI and robotics, to swimming and learning languages.
                    <br></br>
                    <br></br>
                    You can find the online version of my resume <a href={Resume} target="_blank" rel="noreferrer"><b>here<img src={Link} width={linkSize} height={linkSize}></img></b></a> (last updated {lastModifiedResumeDate})
                    <br></br>
                </div>
                <br></br>
                <hr></hr>
                <div className='text-area'>
                    <div className='header'>
                        <u>What am I doing right now?</u>
                    </div>
                    <ul>
                        <li>Implementing AI/ML Research Papers</li>
                        <li>Learning Mandarin</li>
                        <li>Building robots</li>
                        <li>Swimming</li>
                    </ul>
                </div>

                <div className='footer'>
                    <div className="text-area">
                        <div className="header">
                            <u>Contact Me</u>
                        </div>
                        <div className="media-links">
                            <a href='https://x.com/yufeng_liu15' target="_blank" rel="noreferrer"><b>Twitter</b><img src={Link} width={linkSize} height={linkSize}></img></a> / <a href='https://github.com/yufengliu15' target="_blank" rel="noreferrer"><b>Github</b><img src={Link} width={linkSize} height={linkSize}></img></a> / <a href='https://www.linkedin.com/in/liuyuf/' target="_blank" rel="noreferrer"><b>LinkedIn</b><img src={Link} width={linkSize} height={linkSize}></img></a>
                        </div>
                    </div>

                    <div className="text-area">
                        <div className="header">
                            <u>About the Website</u>
                        </div>

                        Website was <b>built and designed by me</b>. Pictures are also all taken by me.
                        <br></br>
                        <br></br>
                        Like the <a href="https://typeof.net/Iosevka/" target="_blank" rel="noreferrer"> <b>font<img src={Link} width={linkSize} height={linkSize}></img></b></a>?
                        <br></br>
                        <br></br>
                        Check out other Carleton University students websites <a href='https://cu-webring.org/' target="_blank" rel="noreferrer"><b>here</b><img src={Link} width={linkSize} height={linkSize}></img></a>! 
                        <br></br>
                        <br></br>
                        Website last edited: {lastModifiedWebsiteDate}
                    </div>
                    <br></br>
                    <br></br>

                    <Logo></Logo>
                </div>

            </div>
        </div>

    )
}

export default HomePage
