import { Schema } from 'mongoose'
import * as mongoose from 'mongoose'

interface IDiceRate extends mongoose.Document {
  user: string
  correct: number
  incorrect: number
}

const schema = new Schema<IDiceRate>({
  user: {
    type: 'string',
    unique: true,
    required: true,
  },
  correct: {
    type: 'number',
    default: 0,
  },
  incorrect: {
    type: 'number',
    default: 0,
  },
})

export const DiceRate = mongoose.model('diceRate', schema, 'diceRate')
