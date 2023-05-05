import type { IUser } from './models'
import * as Discord from 'discord.js'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      qse: IUser
      discord: Discord.User
    }
  }
}
