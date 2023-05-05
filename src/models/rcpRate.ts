import { Schema } from 'mongoose'
import * as mongoose from 'mongoose'

interface IRCPRate extends mongoose.Document {
  user: string
  win: number
  lose: number
  draw: number
}

const schema = new Schema<IRCPRate>({
  user: {
    type: 'string',
    unique: true,
    required: true,
  },
  win: {
    type: 'number',
    default: 0,
  },
  lose: {
    type: 'number',
    default: 0,
  },
  draw: {
    type: 'number',
    default: 0,
  },
})

export const RCPRate = mongoose.model('rcpRate', schema, 'rcpRate')
