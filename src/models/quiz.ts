import mongoose from 'mongoose'

export type AnswerButton = {
    emoji?: string
    label?: string
    answer: string
    style: 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER'
}

export interface IQuiz extends mongoose.Document {
    question: string
    answers: AnswerButton[][]
    ready: boolean
}

const schema = new mongoose.Schema<IQuiz>({
    answers: {
        type: [[Object]],
        default: [] as AnswerButton[][],
    },
    question: {
        type: String,
        required: true,
        index: 'text',
    },
    ready: {
        type: Boolean,
        default: false,
    },
})

export const Quiz = mongoose.model<IQuiz>('Quiz', schema, 'quiz')
