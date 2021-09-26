import mongoose from 'mongoose'

export type QuestionButton = {
    emoji?: string
    label?: string
    answer: string
}

export interface IQuiz extends mongoose.Document {
    question: string
    answers: QuestionButton[][]
}

const schema = new mongoose.Schema<IQuiz>({
    answers: {
        type: [[Object]],
        default: [] as QuestionButton[][],
    },
    question: {
        type: String,
        required: true,
    },
})

export const Quiz = mongoose.model<IQuiz>('Quiz', schema)
