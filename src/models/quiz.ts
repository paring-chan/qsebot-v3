import mongoose from 'mongoose'

export type AnswerButton = {
    emoji?: string
    label?: string
    answer: string
}

export interface IQuiz extends mongoose.Document {
    question: string
    answers: AnswerButton[][]
}

const schema = new mongoose.Schema<IQuiz>({
    answers: {
        type: [[Object]],
        default: [] as AnswerButton[][],
    },
    question: {
        type: String,
        required: true,
    },
})

export const Quiz = mongoose.model<IQuiz>('Quiz', schema, 'quiz')
