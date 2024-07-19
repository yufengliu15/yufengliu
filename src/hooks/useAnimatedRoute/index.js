import { useState, useEffect } from "react"

const useAnimateRoute = () => {
    const [animationClass, setAnimationClass] = useState('route-enter')

    useEffect (() => {
        const timeoutId = setTimeout(() => {
            setAnimationClass('')
        }, 200)

        return () => {
            clearTimeout(timeoutId)
        }
    })

    return animationClass
}

export default useAnimateRoute