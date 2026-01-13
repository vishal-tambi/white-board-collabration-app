import { useEffect, useState } from 'react'

const CHARS = '-./_[]{}#+=@!&^%$*?'

export const useTextScramble = (text: string, trigger = true) => {
    const [displayText, setDisplayText] = useState(text)

    useEffect(() => {
        if (!trigger) return

        let iteration = 0
        let interval: number

        interval = setInterval(() => {
            setDisplayText(() =>
                text
                    .split('')
                    .map((_letter, index) => {
                        if (index < iteration) {
                            return text[index]
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)]
                    })
                    .join('')
            )

            if (iteration >= text.length) {
                clearInterval(interval)
            }

            iteration += 1 / 3
        }, 30)

        return () => clearInterval(interval)
    }, [text, trigger])

    return displayText
}
