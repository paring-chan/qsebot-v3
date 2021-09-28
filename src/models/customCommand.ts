import mongoose from 'mongoose'
import { CommandCondition } from '../sharedTypings'

export interface ICustomCommand extends mongoose.Document {
    message: string
    condition: CommandCondition
    script: string
}

const schema = new mongoose.Schema<ICustomCommand>({
    message: { type: String, required: true },
    condition: {
        enum: CommandCondition,
        type: Number,
        required: true,
    },
    script: {
        type: String,
        required: true,
    },
})

export const CustomCommand = mongoose.model<ICustomCommand>('CustomCommand', schema, 'customCommands')
