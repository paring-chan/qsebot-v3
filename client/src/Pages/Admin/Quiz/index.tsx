import React from 'react'
import { Picker } from 'emoji-mart'
import { useCustomEmojis } from '../../../utils/emojis'

const QuizList: React.FC = () => {
    const emojis = useCustomEmojis()

    return (
        <div>
            <Picker custom={emojis} />
        </div>
    )
}

export default QuizList
