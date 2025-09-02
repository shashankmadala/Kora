import { useEffect, useState } from 'react'

export default function TypewriterText({ text, delay = 0, speed = 100 }: { text: string; delay?: number; speed?: number }) {
    const [displayText, setDisplayText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentIndex < text.length) {
                const typeTimer = setTimeout(() => {
                    setDisplayText((prev) => prev + text[currentIndex])
                    setCurrentIndex((prev) => prev + 1)
                }, speed)

                return () => clearTimeout(typeTimer)
            }
        }, delay)

        return () => clearTimeout(timer)
    }, [currentIndex, text, delay, speed])

    return <>{displayText}</>
}