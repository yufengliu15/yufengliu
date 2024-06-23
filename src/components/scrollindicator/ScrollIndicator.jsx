import React, { useEffect, useState } from 'react'
import { ScrollIcon } from '../../assets'
import './scrollindicator.css'

function ScrollIndicator() {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <div className='indicator-wrapper'>
            <div className={(scrollPosition > 60) ? 'indicator-hide' : 'indicator'}>
                <img className="scroll-icon" src={ScrollIcon} alt="Scroll down..." />
            </div>
        </div>
    )
}

export default ScrollIndicator
