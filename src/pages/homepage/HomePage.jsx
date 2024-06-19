import React from 'react'
import { Navbar, IntroImage, Logo } from '../../components'
import "./homepage.css"
import { Resume, Link } from '../../assets';

function HomePage() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;

    // DD/MM/YYYY
    let lastModifiedWebsiteDate = today;
    let lastModifiedResumeDate = "13/06/2024";

    const linkSize = "14px";

    return (
        <div className="homepage">
            <Navbar></Navbar>
            <IntroImage></IntroImage>
            <div className="text-area">
                <div className="header">
                    <u>About Me</u>
                </div>

                I am a second year <b>Honours Computer Science </b> student at Carleton University located in Ottawa, Ontario. A lot of things interest me, ranging from programming, AI and robotics, to Formula 1, playing music and travelling.
                <br></br>
                <br></br>
                You can find the online version of my resume <a href={Resume} target="_blank"><b>here<img src={Link} width={linkSize} height={linkSize}></img></b></a> (last updated {lastModifiedResumeDate})
                <br></br>
                <br></br>
            </div>

            <div className="text-area">
                <div className="header">
                    <u>Contact Me</u>
                </div>
                Get in touch with me at <b>yufeng.liu15@gmail.com</b>, or click on one of the links below:
                <div className="media-links">
                    <a href='https://x.com/yufeng_liu15' target="_blank">Twitter<img src={Link} width={linkSize} height={linkSize}></img></a> / <a href='https://github.com/yufengliu15' target="_blank">Github<img src={Link} width={linkSize} height={linkSize}></img></a> / <a href='https://www.linkedin.com/in/liuyuf/' target="_blank">LinkedIn<img src={Link} width={linkSize} height={linkSize}></img></a>
                </div>
            </div>

            <div className="text-area">
                <div className="header">
                    <u>About the Website</u>
                </div>

                Built using React.

                <br></br>
                <br></br>

                Deployed using Cloudflare, GitHub pages and .tech domain.

                <br></br>
                <br></br>

                Website was <b>built and designed by me</b>. Pictures are also all taken by me.
                <br></br>
                <br></br>
                Like the <a href="https://typeof.net/Iosevka/" target="_blank"> <b>font<img src={Link} width={linkSize} height={linkSize}></img></b></a>?
                <br></br>
                <br></br>
                Website last edited: {lastModifiedWebsiteDate}
            </div>
            <br></br>
            <br></br>
            <br></br>

            <Logo></Logo>
        </div>
    )
}

export default HomePage
