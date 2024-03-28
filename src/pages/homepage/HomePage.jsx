import React from 'react'
import { Navbar, IntroImage, IntroText } from '../../components'
import "./homepage.css"
import Pdf from '../../assets/Yufeng_Liu_Resume.pdf';

function HomePage() {

  // MM/DD/YYYY
  let lastModifiedWebsiteDate = "03/27/2024";
  let lastModifiedResumeDate = "02/29/2024";

  return (
    <div className="homepage">
      <Navbar></Navbar>
      <IntroText></IntroText>
        <div className="text-area">
            <div className="header">
                <u>About Me</u>
            </div>

            I am a second year <b>Honours Computer Science </b> student at Carleton University located in Ottawa, Ontario. A lot of things interest me, ranging from programming, AI and robotics, to Formula 1, playing music and travelling. 
            <br></br>
            <br></br>
            You can find the online version of my resume <a href = {Pdf} target = "_blank"><b>here</b></a> (last updated {lastModifiedResumeDate})

            <br></br>
        </div>

        <div className="text-area">
            <div className="header">
                <u>Contact Me</u>
            </div>
            Get in touch with me at <b>yufeng.liu15@gmail.com</b>, or click on one of the links below:
            <div className="media-links">
                <a href='https://github.com/yufengliu15' target="_blank">Github</a> / <a href='https://www.linkedin.com/in/liuyuf/' target="_blank">LinkedIn</a>
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
            Like the <a href="https://typeof.net/Iosevka/" target="_blank"> <b>font</b></a>?
            <br></br>
            <br></br>
            Website last edited (MM/DD/YYYY): {lastModifiedWebsiteDate}
        </div>
        <br></br>
        <br></br>
        <br></br>
    </div>
  )
}

export default HomePage
