import mongoose from 'mongoose'
import { ReactionRoleType } from '../sharedTypings'

export interface IReactionRole {
  messageId: string
  roleId: string
  type: ReactionRoleType
  emoji: string
  channel: string
}

const schema = new mongoose.Schema<IReactionRole>({
  messageId: {
    required: true,
    type: String,
  },
  roleId: {
    required: true,
    type: String,
  },
  type: {
    enum: ReactionRoleType,
    required: true,
    type: String,
  },
  channel: {
    type: String,
    required: true,
  },
  emoji: {
    type: String,
    required: true,
  },
})

export const ReactionRole = mongoose.model<IReactionRole>('reactionRole', schema, 'reactionRole')
