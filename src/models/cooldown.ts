import mongoose from 'mongoose'

export interface ICoolDown {
  key: string
  value: number
}

const schema = new mongoose.Schema<ICoolDown>({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
})

export const CoolDown = mongoose.model<ICoolDown>('CoolDown', schema, 'cool')
