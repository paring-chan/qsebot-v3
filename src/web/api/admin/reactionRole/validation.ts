import * as yup from 'yup'
import { ReactionRoleType } from '../../../../sharedTypings'

export const reactionRoleCreateSchema = yup.object().shape({
  channel: yup.string().required(),
  role: yup.string().required(),
  type: yup.mixed<ReactionRoleType>().required().oneOf(Object.values(ReactionRoleType)),
  id: yup.string().required(),
  emoji: yup.string().required(),
})
