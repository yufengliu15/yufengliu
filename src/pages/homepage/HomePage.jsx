import React from 'react'
import { Logo } from '../../components'
import "./homepage.css"
import { Resume, Link } from '../../assets';

import useAnimateRoute from '../../hooks/useAnimatedRoute';

function HomePage() {
    const animationClass = useAnimateRoute()

    // DD/MM/YYYY
    let lastModifiedWebsiteDate = "19/07/2024";
    let lastModifiedResumeDate = "13/06/2024";

    const linkSize = "14px";

    return (
        <div className={animationClass}>
            <div className="homepage">
                <div className='header'>

                </div>
                <div className="text-area">
                    <div className="header">
                        <u>About Me</u>
                    </div>

                    I am a third year <b>Honours Computer Science </b> student at Carleton University located in Ottawa, Ontario.
                    A lot of things interest me, ranging from programming, AI and robotics, to Formula 1, playing music and travelling.
                    <br></br>
                    <br></br>
                    You can find the online version of my resume <a href={Resume} target="_blank" rel="noreferrer"><b>here<img src={Link} width={linkSize} height={linkSize}></img></b></a> (last updated {lastModifiedResumeDate})
                    <br></br>
                </div>
                <br></br>
                <hr></hr>
                <div className='text-area'>
                    <div className='header'>
                        <u>What am I working on right now?</u>
                    </div>

                    <ul>
                        <li>PapersWithKindle</li>
                        <li>Linear Algebra</li>
                        <li>Reading Research Papers</li>
                    </ul>
                </div>

                <div className="text-area">
                    <div className="header">
                        <u>Contact Me</u>
                    </div>
                    Get in touch with me at <b>yufeng.liu15@gmail.com</b>, or click on one of the links below:
                    <div className="media-links">
                        <a href='https://x.com/yufeng_liu15' target="_blank" rel="noreferrer">Twitter<img src={Link} width={linkSize} height={linkSize}></img></a> / <a href='https://github.com/yufengliu15' target="_blank" rel="noreferrer">Github<img src={Link} width={linkSize} height={linkSize}></img></a> / <a href='https://www.linkedin.com/in/liuyuf/' target="_blank" rel="noreferrer">LinkedIn<img src={Link} width={linkSize} height={linkSize}></img></a>
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
                    Website last edited: {lastModifiedWebsiteDate}
                </div>
                <br></br>
                <br></br>

                <Logo></Logo>
            </div>
        </div>

    )
}

export default HomePage
