import mongoose from 'mongoose'

export interface IBlackList extends mongoose.Document {
  trigger: string[]
  script: string
}

const schema = new mongoose.Schema<IBlackList>({
  trigger: [
    {
      type: String,
      required: true,
    },
  ],
  script: {
    type: String,
    required: true,
  },
})

export const Blacklist = mongoose.model<IBlackList>('Blacklist', schema, 'blacklists')
