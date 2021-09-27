import mongoose from 'mongoose'

export interface ICustomCommandScript extends mongoose.Document {
    script: string
    name: string
}

const schema = new mongoose.Schema<ICustomCommandScript>({
    name: { type: String, required: true },
    script: {
        type: String,
        required: true,
    },
})

export const CustomCommandScript = mongoose.model<ICustomCommandScript>('CustomCommandScript', schema, 'customCommandScripts')
