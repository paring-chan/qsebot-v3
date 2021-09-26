import type { AnswerButton } from '../../../src/models'

export const getAnswerCount = (answer: AnswerButton[][]) => {
    let count = 0

    for (const i of answer) {
        count += i.length
    }

    return count
}
