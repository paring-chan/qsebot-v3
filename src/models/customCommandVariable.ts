import mongoose from 'mongoose'

export interface ICustomCommandVariable extends mongoose.Document {
    command: string
    key: string
    value: any
}

const schema = new mongoose.Schema<ICustomCommandVariable>({
    key: {
        type: String,
        required: true,
    },
    value: {
        type: Object,
        required: true,
    },
    command: {
        type: String,
        required: true,
    },
})

export const CustomCommandVariable = mongoose.model<ICustomCommandVariable>('CustomCommandVariable', schema, 'customCommandVariables')
